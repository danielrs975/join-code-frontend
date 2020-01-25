import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DocumentService } from 'src/app/services/document.service';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { ActivatedRoute, Router } from '@angular/router';
import { Operation } from 'src/app/utils/ot';
import { AuthService } from 'src/app/services/auth.service';

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

	constructor(
		private fb: FormBuilder,
		private _documentService: DocumentService,
		private _activatedRoute: ActivatedRoute,
		private auth: AuthService,
		private router: Router
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
		});
		this._documentService.opFromServer.subscribe((operation) => Operation.applyOperation(operation, this.cm));
		this._documentService.updateCursors.subscribe((users) => this.updateCursors(users));
		this._documentService.userLeft.subscribe((user) => this.removeUser(user));
	}

	ngAfterViewInit(): void {
		this.cm = this.codeEditor.codeMirror;
		this.cm.on('changes', (_, changes) => {
			// Ignore the event when is the type of setValue
			if (changes[0].origin == 'setValue' || !changes[0].origin) return;
			const operation = new Operation(changes[0], this.documentForm.value.content).createOperation();
			const version = this._documentService.version;
			this._documentService.sendOperation(operation.toJSON(), this.docId, version, this.cm.getCursor());
		});
		// I'll join the document when all the view is charge
		this._documentService.join(this.docId, this.cm.getCursor());
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
}
