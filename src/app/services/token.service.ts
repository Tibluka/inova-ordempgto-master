import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const TOKEN_URL = " https://inova-pgto.auth.us-west-2.amazoncognito.com/oauth2"

const httpOptions = {
  headers: new HttpHeaders(
    { 
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic NTZyODNnNHFmcG1lZHMxc3ZqN2tuYm80ODE6MWwzbWw1dWZjNDlsYmllMXZiODRqODZlOHRqNWZldjJob2sxM3E5Zmxmbm5kODBmazFsMg=='
    }
  ),
  
};

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private http:HttpClient) { }

  getToken() {
    return this.http.post(`${TOKEN_URL}/token`,`grant_type=client_credentials&scope=inova-pgto/inova-pgto`, httpOptions);
  }
}
