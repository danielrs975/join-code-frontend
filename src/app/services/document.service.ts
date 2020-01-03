import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  updates = new Subject();

  constructor(
    private socket: Socket
  ) {
    this.update();
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
   * This function listen the server in case of
   * new changes
   */
  private update() {
    this.socket.on('change', (update) => {
       this.updates.next(update);
    })
  }

  /**
   * Return an observable to listen the updates
   * in the document
   */
  listenUpdates() {
    return this.updates;
  }
}
