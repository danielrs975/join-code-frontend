import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class DocumentService {
	private updates = new Subject();
	private userJoin = new Subject();
	private userChangePos = new Subject();
	private userLeave = new Subject();

	updateMyPos = new Subject();

	usersInDocument: any = [];
	socketId;
	constructor(private socket: Socket) {
		this.update();
		this.listenNotification();
	}

	/**
   * This function sends to the server the operation that
   * the user did in the document
   * @param operation The operation that the user did
   */
	save(operation) {
		this.socket.emit('save', operation);
	}

	/**
   * This function emit a event when a user join a document
   * @param docId The id of the document we want to join
   */
	join(docId) {
		this.socket.emit('join', { docId, coords: { line: 0, ch: 0, sticky: null } }, (mySocketId) => {
			this.socketId = mySocketId;
		});
	}

	updateCursorPos(docId, coords) {
		this.socket.emit('update-cursor-position', { docId, coords });
	}

	/**
   * Return an observable to listen the updates
   * in the document
   */
	listenUpdates() {
		return this.updates;
	}

	/**
   * Return an observable that listen when
   * a user join in to the document
   */
	listenUserJoinIn() {
		return this.userJoin;
	}

	/**
   * Return an observable that listen when
   * a user change their position in the document
   */
	listenToUserPosition() {
		return this.userChangePos;
	}

	/**
   * Return an observable that listen when
   * a user leaves the document
   */
	listenUserLeaves() {
		return this.userLeave;
	}

	// Listeners
	/**
   * This function listen the server in case of
   * new changes
   */
	private update() {
		this.socket.on('change', (update) => {
			this.updates.next(update);
		});
	}

	/**
   * This function listen to notifications in the document
   */
	private listenNotification() {
		this.socket.on('notification', (not) => {
			console.log(not);
		});

		this.socket.on('user-new-position', (users) => {
			this.usersInDocument = users.filter((user) => user.socket_id !== this.socketId);
			this.userChangePos.next(this.usersInDocument);
			const user = users.find((user) => user.socket_id === this.socketId);
			if (user) this.updateMyPos.next(user);
		});

		this.socket.on('user-leave', ({ users, userRemoved }) => {
			this.usersInDocument = users.filter((user) => user.socket_id !== this.socketId);
			this.userLeave.next(userRemoved);
		});
	}
}
