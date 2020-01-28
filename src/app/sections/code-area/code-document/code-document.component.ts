import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DocumentService } from 'src/app/services/document.service';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { ActivatedRoute, Router } from '@angular/router';
import { Operation } from 'src/app/utils/ot';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { saveAs } from 'file-saver';

@Component({
	selector: 'app-code-document',
	templateUrl: './code-document.component.html',
	styleUrls: [ './code-document.component.scss' ]
})
export class CodeDocumentComponent implements OnInit {
	// We see the text editor to get the position of the cursor
	@ViewChild(CodemirrorComponent, { read: '', static: true })
	codeEditor: CodemirrorComponent;

	// This is the form of the document
	documentForm: FormGroup;
	cm: any; // This is the instance of the code editor

	docId; // The id of the document open
	cursors: any = {}; // It is an object with all the users cursor position
	document: any;

	users: any;

	profile: any;

	constructor(
		private fb: FormBuilder,
		private _documentService: DocumentService,
		private _activatedRoute: ActivatedRoute,
		private auth: AuthService,
		private router: Router,
		private userService: UsersService
	) {
		this.docId = this._activatedRoute.snapshot.params.id;
	}

	ngOnInit() {
		this.documentForm = this.fb.group({
			content: [ '' ]
		});

		// Listen to updates in the document
		this._documentService.docUpdated.subscribe((document) => {
			this.documentForm.patchValue(document);
			this.document = document;
			this.users = document['users'].map((user) => {
				return { ...user, connected: false };
			});
			this.users = this.users.filter((user) => user._id !== this.profile._id);
		});
		this._documentService.opFromServer.subscribe((operation) => Operation.applyOperation(operation, this.cm));
		this._documentService.updateCursors.subscribe((users: any) => {
			this.updateCursors(users);
			this.users.forEach((user) => {
				const isConnected = users.find((userConnected) => user._id === userConnected._id);
				if (isConnected) user.connected = true; // In here we put who are the users that are connected
			});
		});
		this._documentService.userLeft.subscribe((user) => {
			this.removeUser(user);
			const userDisconnected = this.users.find((userConnected) => userConnected._id === user['_id']);
			userDisconnected.connected = false; // When a user left the document we put the its status as disconnected
		});

		this._documentService.comeBackError.subscribe((doc) => {
			this.documentForm.patchValue(doc, { emitEvent: false });
		});
	}

	ngAfterViewInit(): void {
		this.cm = this.codeEditor.codeMirror;
		this.cm.on('changes', (_, changes) => {
			// Ignore the event when is the type of setValue
			changes = changes.reverse();
			if (changes.length === 2) {
				for (let i = 0; i < changes.length; i++) {
					if (changes[i].origin == 'setValue' || !changes[i].origin) return;

					const operation = new Operation(changes[i], this.documentForm.value.content).createOperation();
					if (i == 0) {
						operation.baseLength -= 1;
						operation.targetLengh -= 1;
						operation.ops = operation.ops.map((op) => {
							if (typeof op == 'number') return op - 1;
							else return op;
						});
					}
					console.log(operation);
					const version = this._documentService.version;
					this._documentService.sendOperation(operation.toJSON(), this.docId, version, this.cm.getCursor());
				}
			} else {
				if (changes[0].origin == 'setValue' || !changes[0].origin) return;
				const operation = new Operation(changes[0], this.documentForm.value.content).createOperation();
				const version = this._documentService.version;
				this._documentService.sendOperation(operation.toJSON(), this.docId, version, this.cm.getCursor());
			}
		});

		// I'll join the document when all the view is charge
		this.userService.getProfile().subscribe((me) => {
			this.profile = me;
			this._documentService.join(this.docId, this.cm.getCursor(), this.profile);
		});
	}

	ngOnDestroy(): void {
		//Called once, before the instance is destroyed.
		//Add 'implements OnDestroy' to the class.
		this._documentService.leave();
	}

	/**
	 * This method update all the user's cursor position in the
	 * document
	 * @param users The user to update it cursor position
	 */
	private updateCursors(users) {
		users.forEach((user) => {
			this.addCursor(user);
		});
	}

	/**
	 * This method add a cursor to the text editor
	 * @param user The new user to add to the document
	 */
	private addCursor(user: any) {
		let color;
		if (this.cursors[user.socketId]) {
			color = this.cursors[user.socketId].color;
			this.cursors[user.socketId].cursor.clear();
		} else {
			this.cursors[user.socketId] = {};
			color = '#' + ((Math.random() * 0xffffff) << 0).toString(16);
			this.cursors[user.socketId]['color'] = color;
		}
		let cursorPos = this.cm.posFromIndex(user.cursorPos);
		let cursorCoords = this.cm.cursorCoords(user.cursorPos);
		let newCursor = document.createElement('span');
		newCursor.className = 'other-client';
		// newCursor.style.animation = 'blink 0.5s infinite';
		newCursor.style.display = 'inline-block';
		newCursor.style.padding = '0';
		newCursor.style.marginLeft = newCursor.style.marginRight = '-1px';
		newCursor.style.borderLeftWidth = '2px';
		newCursor.style.borderLeftStyle = 'solid';
		newCursor.style.borderLeftColor = color;
		newCursor.style.height = (cursorCoords.bottom - cursorCoords.top) * 0.9 + 'px';
		newCursor.style.zIndex = '0';
		newCursor.setAttribute('data-clientid', user.socketId);

		this.cursors[user.socketId].cursor = this.cm.setBookmark(user.cursorPos, {
			widget: newCursor,
			insertLeft: true
		});
	}

	private removeUser(user: any) {
		this.cursors[user.socketId].cursor.clear();
		delete this.cursors[user.socketId];
	}

	/**
	 * This method logout the user from the app
	 */
	logOut() {
		this.auth.logout().subscribe((response) => console.log(response), (e) => console.log('Error has ocurred!', e));
		this.router.navigate([ '/login' ]);
	}

	downloadFile() {
		var file = new File([ this.document.content ], this.document.name, { type: 'text/plain;charset=utf-8' });
		saveAs(file);
	}

	run() {
		this._documentService.runDoc(this.document._id);
	}
}
