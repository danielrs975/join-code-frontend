import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  private updates = new Subject();
  // private cursor = new Subject();
  private userLeaves = new Subject();

  constructor(
    private socket: Socket
  ) {
    this.update();
    this.listenNotification();
    // this.getCursors();
    // this.listenToDisconnects();
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
    this.socket.emit('join', {docId, coords: {}});
  }

  /**
   * Return an observable to listen the updates
   * in the document
   */
  listenUpdates() {
    return this.updates;
  }

  /**
   * Return an observable to listen the positions
   * of the cursors of other users
   */
  // listenCursors() {
  //   return this.cursor;
  // }

  /**
   * Return an obsarvable to listen when a user
   * leaves a document
   */
  listenLeaves() {
    return this.userLeaves;
  }

  /**
   * This function send the new coords of the user to the server
   * @param coords The new coords for the user cursor
   */
  updateMyCursor(coords) {
    this.socket.emit('change-cursor', coords);
  }

  // Listeners

  /**
   * This function listen the server in case of
   * new changes
   */
  private update() {
    this.socket.on('change', (update) => {
      this.updates.next(update);
    })
  }

  /**
   * This function listen to updates in the position
   * of the other users in the document
   */
  // private getCursors() {
  //   this.socket.on('update-cursors', (cursor) => {
  //     console.log(cursor);
  //     this.cursor.next(cursor);
  //   })
  // }

  /**
   * This function liste when a user leaves a document
   */
  // private listenToDisconnects() {
  //   this.socket.on('user-leave', (user) => {
  //     this.userLeaves.next(user);
  //   })
  // }

  /**
   * This function listen to notifications in the document
   */
  private listenNotification() {
    this.socket.on('notification', (not) => {
      console.log(not);
    })
  }
}
