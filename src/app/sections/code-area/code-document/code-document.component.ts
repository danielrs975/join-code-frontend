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

  // Seeing how it works
  marker: any;

  constructor(
    private fb: FormBuilder,
    private _documentService: DocumentService
  ) { }

  ngOnInit() {
    this._documentService.join(123);

    // Initialization of the document
    this.documentForm = this.fb.group({
      _id: [123],
      modifyAt: [],
      content: ['']
    })

    // In here we listen when a document changes
    this._documentService.listenUpdates().subscribe((doc) => this.documentForm.patchValue(doc, { emitEvent: false }));

    // In here we listen to the other users position
    this._documentService.listenCursors().subscribe((coords) => this.setUserCursor(coords));

    // In here we listen when a user leaves the document
    this._documentService.listenLeaves().subscribe((user) => this.removeMarker(user));

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
      // console.log(this.cm.cursorCoords());
      // console.log(this.cm.getCursor());
      this._documentService.updateMyCursor(this.cm.getCursor());
    }
  }

  /**
   * In here we update the position of the cursor of a user
   * with a given id
   * @param coords The new coords of a user
   * @param id The id of the user
   */
  private setUserCursor(coords) {
    if (this.marker) this.marker.clear();
    // cm: CodeMirror instance
    // cursorPos: The position of the cursor sent from another client ({line, ch} about CodeMirror)
    
    // Generate DOM node (marker / design you want to display)
    const cursorCoords = this.cm.cursorCoords(true, coords);
    // console.log(cursorCoords);
    const cursorElement = document.createElement('span');
    // console.log(cursorElement);
    cursorElement.style.borderLeftStyle = 'solid';
    cursorElement.style.borderLeftWidth = '1px';
    cursorElement.style.borderLeftColor = '#ff0000';
    cursorElement.style.height = `${(cursorCoords.bottom - cursorCoords.top)}px`;
    cursorElement.style.padding = '0';
    cursorElement.style.zIndex = '0';
    
    // Set the generated DOM node at the position of the cursor sent from another client
    // setBookmark first argument: The position of the cursor sent from another client
    // Second argument widget: Generated DOM node
    this.marker = this.cm.setBookmark(coords, { widget: cursorElement });
  }

  /**
   * This method remove the pointer of the user
   * when he leaves the document
   * @param user The user we want to remove
   */
  private removeMarker(user) {
    console.log("Removing marker")
    this.marker.clear();
  }
}
