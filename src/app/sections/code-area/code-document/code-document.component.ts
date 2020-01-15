import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DocumentService } from 'src/app/services/document.service';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { ActivatedRoute } from '@angular/router';
import * as sdb from 'sharedb';
import * as ws from 'reconnecting-websocket';
// import {  } from 'sharedb';

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

	// The id of the document open
	docId;
	socket: any;
	connection: any;
	constructor(
		private fb: FormBuilder,
		private _documentService: DocumentService,
		private _activatedRoute: ActivatedRoute
	) {
		this.docId = this._activatedRoute.snapshot.params.id;
		this.socket = new ws.default('ws://localhost:8080');
		console.log(sdb);
		// this.connection = new Connection(this.socket).get('example', '123');
	}

	ngOnInit() {
		this._documentService.join(this.docId);
		this.documentForm = this.fb.group({
			content: [ '' ]
		});
	}

	ngAfterViewInit(): void {
		this.cm = this.codeEditor.codeMirror;
		this.cm.on('changes', (_, changes) => {
			// Here it goes the changes
		});
	}
}
