import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  private updates = new Subject();
  private cursor = new Subject();

  constructor(
    private socket: Socket
  ) {
    this.update();
    this.getCursors();
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
  listenCursors() {
    return this.cursor;
  }

  /**
   * This function send the new coords of the user to the server
   * @param coords The new coords for the user cursor
   */
  updateMyCursor(coords) {
    this.socket.emit('change-cursor', coords);
  }

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
  private getCursors() {
    this.socket.on('update-cursors', (cursor) => {
      this.cursor.next(cursor);
    })
  }
}
