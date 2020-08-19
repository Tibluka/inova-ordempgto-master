import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from './token.service';

const API_URL = "https://f2rkl509o9.execute-api.us-west-2.amazonaws.com/dev"

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http:HttpClient, private tokenService: TokenService) { }

  logar(userForm: any) {
    return new Promise((resolve, reject) => {
      this.tokenService.getToken()
      .subscribe(tkn  => {
        let token = tkn['access_token'];

        let httpOptions = {
          headers: new HttpHeaders(
            { 'Content-Type': 'application/json',
              'Authorization': token
            }
          )
        };
        
        this.http.post(`${API_URL}/login`,userForm, httpOptions)
        .subscribe(loginData => {
          resolve(loginData)
        },
        err => {
          reject(err)
        })

      },
      err => {
        reject(err)
      })
    })
   
  }
}
