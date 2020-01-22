import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DocumentApiService } from 'src/app/services/document-api.service';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: [ './dashboard.component.scss' ]
})
export class DashboardComponent implements OnInit {
	userLogged: any;
	userDocuments: any;
	sharedDocuments: any;

	docSelected: string; // This is for the sharing function

	constructor(
		private usersService: UsersService,
		private router: Router,
		private auth: AuthService,
		private docApiService: DocumentApiService
	) {}

	ngOnInit() {
		// Getting profile info and documents info at the same time
		forkJoin(this.usersService.getProfile(), this.usersService.getDocuments()).subscribe((responses) => {
			this.userLogged = responses[0]; // User profile
			this.userDocuments = responses[1]['documents']; // User own documents
			this.sharedDocuments = responses[1]['sharedDocuments']; // User shared documents
		});
	}

	/**
	 * This method open a document in the editor 
	 * @param id The id of the document to open
	 */
	openDoc(id: string) {
		this.router.navigate([ 'document', id ]);
	}

	/**
	 * This method create a new document in the database
	 * @param name The name of the new document
	 */
	createDoc(name: string) {
		if (name.length == 0) return console.log('The string cannot be empty');
		this.docApiService.create({ name }).subscribe(() => {
			this.usersService.getDocuments().subscribe((newDocuments) => {
				this.userDocuments = newDocuments['documents'];
			});
		});
	}

	/**
	 * This method select a document to share
	 * @param id The id of the document selected
	 */
	selectDoc(id: string) {
		this.docSelected = id;
	}

	shareDoc(email: string) {
		if (email.length == 0) return console.log('The email is wrong');
		this.usersService.getUserId(email).subscribe((response) => {
			const userId = response['_id'];
			this.docApiService.share([ userId ], this.docSelected).subscribe((isShared) => console.log(isShared));
		});
	}

	/**
	 * This method logout the user from the app
	 */
	logOut() {
		this.auth.logout().subscribe((response) => console.log(response), (e) => console.log('Error has ocurred!', e));
		this.router.navigate([ '/login' ]);
	}
}
