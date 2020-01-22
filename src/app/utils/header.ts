import { HttpHeaders } from '@angular/common/http';

function getHeaders(token?: string) {
	const headers = new HttpHeaders({
		'Content-Type': 'application/json'
	});
	if (token) headers.append('Authorization', `Bearer ${token}`);
	return headers;
}
export { getHeaders };
