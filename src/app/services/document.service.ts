import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Operation } from '../utils/ot';
import { Subject } from 'rxjs';
import * as ot from 'ot';
@Injectable({
	providedIn: 'root'
})
export class DocumentService {
	// Subjects to emit events
	docUpdated = new Subject();
	notifications = new Subject();
	opFromServer = new Subject();

	// The version is really important for the algorithm
	// We are going to get it from the document when we join
	version: number;

	socketId: string;
	documentIsSynchronized = true;
	buffer: any;
	waitingAkn: any;

	versionOfBufferOp: number;

	constructor(private socket: Socket) {
		// Run the listeners of the doc
		this.onReceiveOperation();
		this.onNotifications();
		this.onChangeVersion();
	}

	join(docId: string, cursorPos: any) {
		this.socket.emit('join', { docId, cursorPos }, ({ err, socketId, doc, users }) => {
			if (err) console.log(err);
			this.socketId = socketId;
			this.version = doc.version;
			this.docUpdated.next(doc);
			console.log(users);
		});
	}

	sendOperation(operation: any, docId: string, version: number) {
		this.documentIsSynchronized = false;
		// If not send the operation to server to processed
		if (this.waitingAkn && operation) {
			// If the buffer is with an other operation waiting to be processed
			// then compose the buffer operation with the new operation
			if (this.buffer) {
				operation = Operation.fromJSON(operation);
				this.buffer = this.buffer.compose(operation);
			} else {
				this.buffer = Operation.fromJSON(operation);
				this.versionOfBufferOp = version;
			}
			return;
		}

		// If the operation is not defined then we are running the function with an operation
		// that was waiting in the buffer
		if (!operation) {
			operation = this.buffer.toJSON();
			this.buffer = undefined;
		}
		this.waitingAkn = operation;
		setTimeout(() => {
			this.socket.emit(
				'operation',
				{ operation, meta: { socketId: this.socketId, docId, version } },
				(operationProcessed) => {
					if (operationProcessed) {
						// If exists some operations that are in the buffer
						// Send it to the server an put it in the waiting aknowledgement variable
						this.waitingAkn = undefined;
						this.documentIsSynchronized = true;
						if (this.buffer) this.sendOperation(undefined, docId, this.versionOfBufferOp);
						// this.version += 1;
					} else console.log('The error ocurred while applying your operation');
				}
			);
		}, 5000);
	}

	/**
	 * This method listen to new changes in the doc 
	 * of the server. But we are receiving for now the doc complete.
	 * We are going to try improve sending only the operation.
	 */
	private onChangeVersion() {
		this.socket.on('changeVersion', (doc) => {
			this.version = doc.version;
			// this.docUpdated.next(doc);
		});
	}

	/**
	 * Experimental on Receive operation
	 */
	private onReceiveOperation() {
		this.socket.on('operation', (operation) => {
			operation = ot.TextOperation.fromJSON(operation);

			this.waitingAkn =
				this.waitingAkn ? ot.TextOperation.fromJSON(this.waitingAkn) :
				undefined;
			let transform1;
			let transform2;
			// We check is we have any operation waiting for aknowledgment
			// If not we apply the operation directly to the document
			// If yes then we have a document that has conflicts we transform the operation
			// coming with the operation already applied to the doc and merge the document
			// We also have to transform the operation that is in the buffer.
			if (this.waitingAkn) {
				transform1 = ot.TextOperation.transform(this.waitingAkn, operation);
				if (this.buffer) transform2 = ot.TextOperation.transform(this.buffer, transform1[1]);
				this.waitingAkn = transform1[0];
				this.buffer =
					transform2 ? transform2[0] :
					undefined;
				operation =
					transform2 ? transform2[1] :
					transform1[1];
			}
			this.opFromServer.next(operation);
		});
	}

	/**
	 * This method listen to incoming notifications of the document
	 * like user entering or leaving the document
	 */
	private onNotifications() {
		this.socket.on('notification', ({ type, msg, info }) => {
			switch (type) {
				case 'join':
					const users = info.users.filter((user) => user.socketId !== this.socketId);
					console.log(users);
					break;
				case 'left':
					console.log(msg, info.user);
					break;
			}
		});
	}
}
