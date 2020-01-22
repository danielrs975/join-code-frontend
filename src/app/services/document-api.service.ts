// Angular imports
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// App imports
import { environment } from 'src/environments/environment';
import { getHeaders } from '../utils/header';
import { AuthService } from './auth.service';

@Injectable({
	providedIn: 'root'
})
export class DocumentApiService {
	private apiUrls = {
		create: `${environment.apiServer}documents`,
		share: `${environment.apiServer}documents`
	};

	constructor(private http: HttpClient, private auth: AuthService) {}

	/**
   * This method create a new document
   * @param form This contain the basic information to create a new document
   */
	create(form) {
		const headers = getHeaders(this.auth.getToken());
		const body = form;
		return this.http.post(this.apiUrls.create, body, { headers });
	}

	/**
   * This method share a document to the given users
   * @param users The users you want to share the documents
   * @param id The id of the document you want to share
   */
	share(users, id: any) {
		const headers = getHeaders(this.auth.getToken());
		const body = { users };
		return this.http.patch(`${this.apiUrls.share}/${id}/share`, body, { headers });
	}
}
