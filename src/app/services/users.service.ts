import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { getHeaders } from '../utils/header';

@Injectable({
	providedIn: 'root'
})
export class UsersService {
	private apiUrls = {
		signup: `${environment.apiServer}users/signup`
	};

	constructor(private http: HttpClient) {}

	signup(form) {
		const headers = getHeaders();
		const body = form;
		console.log(form);
		// return this.http.post(this.apiUrls.signup, body, { headers });
	}
}
