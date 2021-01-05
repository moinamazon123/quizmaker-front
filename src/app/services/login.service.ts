import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';

import {AppConst} from '../constants/app-const';
import {Router} from '@angular/router';


@Injectable()
export class LoginService {
  private serverPath:string = AppConst.serverPath;



  constructor(private http:Http, private router:Router) { }

  sendCredential(username: string, password: string) {


  	let url = this.serverPath+'/token';
    let encodedCredentials = btoa(username+":"+password);
    localStorage.setItem('loginUser',username);
  	let basicHeader = "Basic "+encodedCredentials;
  	let headers = new Headers({
  		'Content-Type' : 'application/x-www-form-urlencoded',
  		'Authorization' : basicHeader
  	});

  	return this.http.get(url, {headers: headers});
  }

  login(username: string, password: string) {


  	let url = this.serverPath+'/login';
    let credentials = new Object();
    credentials["username"]= username;
    credentials["password"] = password;
    let encodedCredentials = btoa(username+":"+password);
  	let basicHeader = "Basic "+encodedCredentials;
  	let headers = new Headers({
  		'Content-Type' : 'application/json',
  		'Authorization' : basicHeader
  	});

  	return this.http.post(url,JSON.stringify(credentials),  {headers: headers});
  }

  checkSession() {

  	let url = this.serverPath+'/checkSession';
  	let headers = new Headers({
  		'x-auth-token' : localStorage.getItem('xAuthToken')
  	});

  	return this.http.get(url);
  }

  logout() {
  	let url = this.serverPath+'/user/logout';
  	let headers = new Headers({
  		'x-auth-token' : localStorage.getItem('xAuthToken')
  	});

  	return this.http.post(url, '', {headers: headers});
  }

 

}
