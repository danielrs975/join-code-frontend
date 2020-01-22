import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
	selector: 'app-sign-up',
	templateUrl: './sign-up.component.html',
	styleUrls: [ './sign-up.component.scss' ]
})
export class SignUpComponent implements OnInit {
	signupForm: FormGroup;
	constructor(private fb: FormBuilder, private usersService: UsersService, private router: Router) {}

	ngOnInit() {
		this.signupForm = this.fb.group({
			name: [ '' ],
			email: [ '' ],
			password: [ '' ]
		});
	}

	onSubmit(values) {
		this.usersService.signup(values).subscribe(
			() => {
				this.router.navigate([ 'dashboard' ]);
			},
			(e) => console.log('An error ocurred!', e)
		);
	}
}
