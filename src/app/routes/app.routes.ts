import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CodeDocumentComponent } from '../sections/code-area/code-document/code-document.component';

const routes: Routes = [
    { path: 'document/:id', component: CodeDocumentComponent }
];

@NgModule({
    imports: [
        CommonModule, 
        RouterModule.forRoot(routes), 
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
