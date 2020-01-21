import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';
import { getHeaders } from '../utils/header';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private authUrls = {
		login: `${environment.apiServer}users/login`,
		logout: `${environment.apiServer}users/logout`
	};

	constructor(private http: HttpClient) {}

	/**
   * This method login the user to the system
   * @param form The email and the password who wants to login
   */
	login(form) {
		const headers = getHeaders();
		const body = form;
		return this.http
			.post(this.authUrls.login, body, { headers })
			.pipe(tap((response) => this.saveToken(response['token'])));
	}

	/**
   * This method logout the user from the system
   */
	logout() {
		const headers = getHeaders(this.getToken());
		const body = {};
		localStorage.removeItem('token');
		return this.http.post(this.authUrls.logout, body, { headers });
	}

	/**
   * This method save the token of the user in the local storage of its session
   * @param token The token of authorization to make the other requests
   */
	saveToken(token: string) {
		localStorage.setItem('token', token);
	}

	/**
   * This method get the token of the user saved in the localstorage
   */
	getToken() {
		return localStorage.getItem('token');
	}
}
