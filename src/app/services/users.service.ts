import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { getHeaders } from '../utils/header';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
	providedIn: 'root'
})
export class UsersService {
	private apiUrls = {
		signup: `${environment.apiServer}users/signup`,
		profile: `${environment.apiServer}users/me/profile`,
		documents: `${environment.apiServer}users/me/documents`
	};

	constructor(private http: HttpClient, private auth: AuthService) {}

	/**
	 * This method send a request to the api to create a new user
	 * @param form The values to create a new user
	 */
	signup(form) {
		const headers = getHeaders();
		const body = form;
		return this.http.post(this.apiUrls.signup, body, { headers }).pipe(
			tap((response) => {
				this.auth.saveToken(response['token']);
			})
		);
	}

	/**
	 * This method gets the basic information of the user currently logged
	 */
	getProfile() {
		const headers = getHeaders(this.auth.getToken());
		return this.http.get(this.apiUrls.profile, { headers });
	}

	getDocuments() {
		const headers = getHeaders(this.auth.getToken());
		return this.http.get(this.apiUrls.documents, { headers });
	}
}
