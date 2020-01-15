import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Operation } from '../utils/ot';
import { Subject } from 'rxjs';
@Injectable({
	providedIn: 'root'
})
export class DocumentService {
	// Subjects to emit events
	docUpdated = new Subject();
	notifications = new Subject();

	// The version is really important for the algorithm
	// We are going to get it from the document when we join
	version: number;

	socketId: string;
	documentIsSynchronized = true;
	buffer: any;
	waitingAkn: any;
	constructor(private socket: Socket) {
		// Run the listeners of the doc
		this.onReceiveOperation();
		this.onNotifications();
	}

	join(docId: string) {
		this.socket.emit('join', { docId }, ({ err, socketId, doc }) => {
			if (err) console.log(err);
			this.socketId = socketId;
			this.version = doc.version;
			this.docUpdated.next(doc);
		});
	}

	sendOperation(operation: any, docId: string) {
		this.documentIsSynchronized = false;
		// If not send the operation to server to processed
		if (this.waitingAkn && operation) {
			// If the buffer is with an other operation waiting to be processed
			// then compose the buffer operation with the new operation
			if (this.buffer) {
				operation = Operation.fromJSON(operation);
				this.buffer = this.buffer.compose(operation);
			} else this.buffer = Operation.fromJSON(operation);
			return;
		}

		// If the operation is not defined then we are running the function with an operation
		// that was waiting in the buffer
		if (!operation) {
			operation = this.buffer.toJSON();
			this.buffer = undefined;
		}

		this.waitingAkn = operation;
		this.socket.emit(
			'operation',
			{ operation, meta: { socketId: this.socketId, docId, version: this.version } },
			(operationProcessed) => {
				if (operationProcessed) {
					// If exists some operations that are in the buffer
					// Send it to the server an put it in the waiting aknowledgement variable
					this.waitingAkn = undefined;
					this.documentIsSynchronized = true;
					if (this.buffer) this.sendOperation(undefined, docId);
					this.version += 1;
				} else console.log('The error ocurred while applying your operation');
			}
		);
	}

	/**
	 * This method listen to new changes in the doc 
	 * of the server. But we are receiving for now the doc complete.
	 * We are going to try improve sending only the operation.
	 */
	private onReceiveOperation() {
		this.socket.on('operation', (doc) => {
			this.version = doc.version;
			this.docUpdated.next(doc);
		});
	}

	/**
	 * This method listen to incoming notifications of the document
	 * like user entering or leaving the document
	 */
	private onNotifications() {
		this.socket.on('notification', (msg) => {
			console.log(msg);
		});
	}
}
