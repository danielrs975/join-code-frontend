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
		signup: `${environment.apiServer}users/signup`
	};

	constructor(private http: HttpClient, private auth: AuthService) {}

	signup(form) {
		const headers = getHeaders();
		const body = form;
		return this.http.post(this.apiUrls.signup, body, { headers }).pipe(
			tap((response) => {
				this.auth.saveToken(response['token']);
			})
		);
	}
}
