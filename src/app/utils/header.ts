import { HttpHeaders } from '@angular/common/http';

/**
 * This method build the headers to make a request to the api
 * @param token The auth token of the user
 */
function getHeaders(token?: string) {
	let headers = new HttpHeaders({
		'Content-Type': 'application/json'
	});
	if (token) headers = headers.append('Authorization', `Bearer ${token}`);
	return headers;
}
export { getHeaders };
