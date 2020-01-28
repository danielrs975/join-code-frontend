import { Component, OnInit, ViewChild } from '@angular/core';
import { NgTerminal } from 'ng-terminal';
import { AttachAddon } from 'xterm-addon-attach';

@Component({
	selector: 'app-terminal',
	templateUrl: './terminal.component.html',
	styleUrls: [ './terminal.component.scss' ]
})
export class TerminalComponent implements OnInit {
	@ViewChild('term', { static: true })
	child: NgTerminal;

	constructor() {}

	ngOnInit() {}

	ngAfterViewInit() {
		// this.child.write('$ ');
		this.child.keyEventInput.subscribe((e) => {
			// console.log('keyboard event:' + e.domEvent.keyCode + ', ' + e.key);

			const ev = e.domEvent;
			const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

			if (ev.keyCode === 13) {
				this.child.write('\r\n$ ');
			} else if (ev.keyCode === 8) {
				// Do not delete the prompt
				if (this.child.underlying.buffer.cursorX > 2) {
					this.child.write('\b \b');
				}
			} else if (printable) {
				this.child.write(e.key);
			}
		});
		const socket = new WebSocket('ws://localhost:3002/');
		socket.onopen = () => {
			const attachAddon = new AttachAddon(socket);
			this.child['term'].loadAddon(attachAddon);
		};
		socket.onclose = () => {
			console.log('closing conection');
		};
	}
}
