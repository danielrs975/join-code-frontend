import { HttpHeaders } from '@angular/common/http';

function getHeaders(token?: string) {
	let headers = new HttpHeaders({
		'Content-Type': 'application/json'
	});
	if (token) headers = headers.append('Authorization', `Bearer ${token}`);
	return headers;
}
export { getHeaders };
