import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { forkJoin } from 'rxjs';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: [ './dashboard.component.scss' ]
})
export class DashboardComponent implements OnInit {
	userLogged: any;
	userDocuments: any;
	sharedDocuments: any;

	constructor(private usersService: UsersService) {}

	ngOnInit() {
		// Getting profile info and documents info at the same time
		forkJoin(this.usersService.getProfile(), this.usersService.getDocuments()).subscribe((responses) => {
			this.userLogged = responses[0]; // User profile
			this.userDocuments = responses[1]['documents']; // User own documents
			this.sharedDocuments = responses[1]['sharedDocuments']; // User shared documents
		});
	}
}
