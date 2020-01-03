import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DocumentService } from 'src/app/services/document.service';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';


@Component({
  selector: 'app-code-document',
  templateUrl: './code-document.component.html',
  styleUrls: ['./code-document.component.scss']
})
export class CodeDocumentComponent implements OnInit {

  // We see the text editor to get the position of the cursor
  @ViewChild(CodemirrorComponent, {read: '', static: true}) codeEditor: CodemirrorComponent;

  // This is the form of the document
  documentForm: FormGroup
  cm: any;

  constructor(
    private fb: FormBuilder,
    private _documentService: DocumentService
  ) { }

  ngOnInit() {
    // Initialization of the document
    this.documentForm = this.fb.group({
      _id: [123],
      modifyAt: [],
      content: ['']
    })

    // In here we listen when a document changes
    this._documentService.listenUpdates().subscribe((doc) => this.documentForm.patchValue(doc, { emitEvent: false }));

    this.documentForm.valueChanges.subscribe((value) => {
      this.saveDocument(value);
    })
  }

  ngAfterViewInit(): void {
    // console.log(this.codeEditor.codeMirror.cursorCoords());
    this.cm = this.codeEditor.codeMirror;
  }

  /**
   * This function save the document in the database
   * @param value The new content of the document
   */
  saveDocument(value) {
    this._documentService.save(value);
  }

  sendCursorPos() {
    if (this.cm) {
      console.log(this.cm.cursorCoords());
    }
  }
}
