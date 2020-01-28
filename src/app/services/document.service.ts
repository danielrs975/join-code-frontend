import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Operation } from '../utils/ot';
import { Subject } from 'rxjs';
import * as ot from 'ot';
import { ChildActivationStart } from '@angular/router';
@Injectable({
	providedIn: 'root'
})
export class DocumentService {
	// Subjects to emit events
	docUpdated = new Subject();
	notifications = new Subject();
	opFromServer = new Subject();
	updateCursors = new Subject();
	userLeft = new Subject();

	comeBackError = new Subject();
	// The version is really important for the algorithm
	// We are going to get it from the document when we join
	version: number;

	socketId: string;
	documentIsSynchronized = true;
	buffer: any;
	waitingAkn: any;

	versionOfBufferOp: number;
	bufferCursorPos: number;

	constructor(private socket: Socket) {
		// Run the listeners of the doc
		this.onReceiveOperation();
		this.onNotifications();
		this.onChangeVersion();
	}

	/**
	 * This method allow the user to join a document and receives information
	 * about the other users that are editing the document
	 * @param docId The id of the doc we want to join
	 * @param cursorPos The position of the cursor of the user that is join in
	 */
	join(docId: string, cursorPos: any, userInfo: any) {
		this.socket.connect();
		this.socket.emit('join', { ...userInfo, docId, cursorPos }, ({ err, socketId, doc, users }) => {
			if (err) console.log(err);
			this.socketId = socketId;
			this.version = doc.version;
			this.docUpdated.next(doc);
			this.updateCursors.next(users);
		});
	}

	sendOperation(operation: any, docId: string, version: number, cursorPos: any) {
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
			this.bufferCursorPos = cursorPos;
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
				{ operation, meta: { socketId: this.socketId, docId, version, cursorPos } },
				(operationProcessed, doc) => {
					if (operationProcessed) {
						// If exists some operations that are in the buffer
						// Send it to the server an put it in the waiting aknowledgement variable
						this.waitingAkn = undefined;
						this.documentIsSynchronized = true;
						if (this.buffer)
							this.sendOperation(undefined, docId, this.versionOfBufferOp, this.bufferCursorPos);
						// this.version += 1;
					} else {
						console.log('The error ocurred while applying your operation. Restarting');
						this.comeBackError.next(doc);
						this.version = doc.version;
						this.buffer = undefined;
						this.waitingAkn = undefined;
						// this.sendOperation(this.waitingAkn, docId, version, cursorPos);
					}
				}
			);
		}, 15000);
	}

	/**
	 * This method send a event to the back saying that
	 * the user leaves the document
	 */
	leave() {
		this.socket.disconnect();
	}

	runDocPython(id: string) {
		this.socket.emit('runPython', id);
	}

	runDocC(id: string) {
		this.socket.emit('runC', id);
	}

	runDocJava(id: string) {
		this.socket.emit('runJava', id);
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
			let users;
			switch (type) {
				case 'join':
					users = info.users.filter((user) => user.socketId !== this.socketId);
					this.updateCursors.next(users);
					break;
				case 'pos':
					users = info.users.filter((user) => user.socketId !== this.socketId);
					this.updateCursors.next(users);
					break;
				case 'left':
					this.userLeft.next(info.user);
					break;
			}
		});
	}
}
