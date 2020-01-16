import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DocumentService } from 'src/app/services/document.service';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { ActivatedRoute } from '@angular/router';
import { Operation } from 'src/app/utils/ot';

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
	}

	ngOnInit() {
		this._documentService.join(this.docId);
		this.documentForm = this.fb.group({
			content: [ '' ]
		});

		// Listen to updates in the document
		this._documentService.docUpdated.subscribe((document) => this.documentForm.patchValue(document));
	}

	ngAfterViewInit(): void {
		this.cm = this.codeEditor.codeMirror;
		this.cm.on('changes', (_, changes) => {
			// Ignore the event when is the type of setValue
			if (changes[0].origin == 'setValue') return;
			const operation = new Operation(changes[0], this.documentForm.value.content).createOperation();

			setTimeout(() => {
				this._documentService.sendOperation(operation.toJSON(), this.docId);
			}, 5000);
		});
	}
}
