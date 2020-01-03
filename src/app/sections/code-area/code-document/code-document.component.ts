import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Socket } from 'ngx-socket-io';


@Component({
  selector: 'app-code-document',
  templateUrl: './code-document.component.html',
  styleUrls: ['./code-document.component.scss']
})
export class CodeDocumentComponent implements OnInit {

  // This is the form of the document
  documentForm: FormGroup

  constructor(
    private fb: FormBuilder,
    private socket: Socket
  ) { }

  ngOnInit() {
    // Initialization of the document
    this.documentForm = this.fb.group({
      _id: [123],
      modifyAt: [],
      content: ['']
    })

    // In here we listen when a document changes
    this.socket.on('change', (doc) => {
      this.documentForm.patchValue(doc, { emitEvent: false });
    })

    this.documentForm.valueChanges.subscribe((value) => {
      this.saveDocument(value);
    })
  }

  /**
   * This function save the document in the database
   * @param value The new content of the document
   */
  saveDocument(value) {
    this.socket.emit('save', value);
  }
}
