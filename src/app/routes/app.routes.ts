import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CodeDocumentComponent } from '../sections/code-area/code-document/code-document.component';
import { LoginComponent } from '../sections/login/login.component';
import { SignUpComponent } from '../sections/sign-up/sign-up.component';
import { AuthGuard } from '../_guards/auth.guard';

const routes: Routes = [
	{ path: 'document/:id', canActivate: [ AuthGuard ], component: CodeDocumentComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'signup', component: SignUpComponent },
	{ path: '**', redirectTo: 'document/123' }
];

@NgModule({
	imports: [ CommonModule, RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule {}
