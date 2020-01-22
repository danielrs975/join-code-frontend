import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: [ './login.component.scss' ]
})
export class LoginComponent implements OnInit {
	loginForm: FormGroup;
	constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

	ngOnInit() {
		this.loginForm = this.fb.group({
			email: [ '' ],
			password: [ '' ]
		});
	}

	/**
   * This method send a request to the api to login a user
   * @param values The values of the form
   */
	onSubmit(values) {
		this.auth.login(values).subscribe(() => this.router.navigate([ 'dashboard' ]), (e) => console.log(e));
	}
}
