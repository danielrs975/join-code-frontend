import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
@Injectable({
	providedIn: 'root'
})
export class DocumentService {
	constructor(private socket: Socket) {}

	join(docId) {
		this.socket.emit('join', { docId }, (info) => {
			console.log(info);
		});
	}
}
