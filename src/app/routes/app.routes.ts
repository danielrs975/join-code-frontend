import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CodeDocumentComponent } from '../sections/code-area/code-document/code-document.component';
import { DashboardComponent } from '../sections/dashboard/dashboard.component';

const routes: Routes = [
    { path: 'document/:id', component: CodeDocumentComponent },
    { path: 'dashboard', component: DashboardComponent }
];

@NgModule({
    imports: [
        CommonModule, 
        RouterModule.forRoot(routes), 
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
