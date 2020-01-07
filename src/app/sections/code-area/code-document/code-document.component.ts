import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DocumentService } from 'src/app/services/document.service';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { ActivatedRoute } from '@angular/router';
import { debounceTime } from 'rxjs/operators';

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
  cm: any; // This is the instance of the code editor

  // Seeing how it works
  markers: any = {};
  colors: any = {};

  // The id of the document open
  docId;
  
  constructor(
    private fb: FormBuilder,
    private _documentService: DocumentService,
    private _activatedRoute: ActivatedRoute
  ) { 
    this.docId = this._activatedRoute.snapshot.params.id
  }

  ngOnInit() {
    // First a join the document
    this._documentService.join(this._activatedRoute.snapshot.params.id);

    // Initialization of the document
    this.documentForm = this.fb.group({
      _id: [this._activatedRoute.snapshot.params.id],
      modifyAt: [],
      content: ['']
    })

    // In here we listen when a document changes
    this._documentService.listenUpdates().pipe(
      debounceTime(50)
    ).subscribe((doc) => {
      if (this.cm) {
        const realCoords = this.cm.getCursor();
        this.documentForm.patchValue(doc, { emitEvent: false });
        this.cm.setCursor(realCoords);
      }
      this.documentForm.patchValue(doc, { emitEvent: false });
    });

    // This listener listen when a user join to the document or leave it
    this._documentService.listenUserJoinIn().subscribe((user) => {
      this.setUserCursor(user, this.cm.getCursor());
    })
    this._documentService.listenUserLeaves().subscribe((user) => {
      this.removeUserCursor(user);
    })
    this._documentService.listenToUserPosition().subscribe((user) => {
      this.setUserCursor(user, user['coords']);
    })

    this.documentForm.valueChanges.subscribe((value) => {
      this.saveDocument(value)
    });
  }
  /**
   * This function save the document in the database
   * @param value The new content of the document
   */
  saveDocument(value) {
    this._documentService.save(value);
  }

  /**
   * This method get the event when the user change
   * the position of its cursor
   */
  updateCursorPos() {
    if (this.cm) this._documentService.updateCursorPos(this.docId ,this.cm.getCursor());
  }

  ngAfterViewInit(): void {
    this.cm = this.codeEditor.codeMirror;
  }

  /**
   * In here we update the position of the cursor of a user
   * with a given id
   * @param coords The new coords of a user
   * @param id The id of the user
   */
  private setUserCursor(user, coords) {
    console.log(user, coords);
    if (this.markers[user.socket_id]) this.markers[user.socket_id].clear();
    // cm: CodeMirror instance
    // cursorPos: The position of the cursor sent from another client ({line, ch} about CodeMirror)
    
    // Generate DOM node (marker / design you want to display)
    const cursorCoords = this.cm.cursorCoords(true, coords);

    const cursorElement = document.createElement('span');
    cursorElement.style.animation = '1s blink step-end infinite'
    cursorElement.style.borderLeftStyle = 'solid';
    cursorElement.style.borderLeftWidth = '1.2px';

    if (!this.colors[user.socket_id]) {
      this.colors[user.socket_id] = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
    }

    console.log(this.colors[user.socket_id]);
    cursorElement.style.borderLeftColor = this.colors[user.socket_id]; 
    cursorElement.style.height = `${(cursorCoords.bottom - cursorCoords.top)}px`;
    cursorElement.style.padding = '0';
    cursorElement.style.zIndex = '0'; 
    
    // Set the generated DOM node at the position of the cursor sent from another client
    // setBookmark first argument: The position of the cursor sent from another client
    // Second argument widget: Generated DOM node
    this.markers[user.socket_id] = this.cm.setBookmark(coords, { widget: cursorElement });
    console.log(this.markers[user.socket_id]);
  }

  /**
   * Remove the cursor from the code editor
   * @param user The user that just leave the document
   */
  private removeUserCursor(user) {
    if (this.markers[user.socket_id]) this.markers[user.socket_id].clear();
  }
}
