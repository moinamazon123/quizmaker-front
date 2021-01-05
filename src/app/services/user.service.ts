import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import {AppConst} from '../constants/app-const';
import {User} from '../models/user';
import { AssignRole } from '../models/AssignRole';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserService {
  private serverPath: string = AppConst.serverPath;

  constructor(private http:Http ,private httpClient:HttpClient) { }

 // newUser(username: string, email:string) {
  newUser(user: User) {
  	let url = this.serverPath+'/user/newUser';
  	let userInfo = {
  		"username" : user.username,
      "email" : user.email,
      "password" : user.password,
      "city" : user.city,
      "address" : user.address,
      "phone" : user.phone,
      "state" : user.state,
  		"country" : user.country
  	}
  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem('xAuthToken')
  	});

  	return this.http.post(url, JSON.stringify(userInfo), {headers : tokenHeader});
  }

  checkEmail(email:string){
    let url = this.serverPath+'/user/checkEmail/'+email;

    return this.http.get(url);

  }
  checkUsername(username:string){
    let url = this.serverPath+'/user/checkUserName/'+username;

    return this.http.get(url);

  }

addProfileImage(userId,file){

    let url ='';   let formData = new FormData();
   
        url = AppConst.serverPath+"/user/add/profileimage/"+userId;  
        
              formData.append("picture", file);
           
    return this.httpClient.post(url,formData);

 }



  assignRole(assignRole : AssignRole) {
    let url = this.serverPath+'/user/addRoles';
    console.log(assignRole);
    let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem('xAuthToken')
  	});

  	return this.http.post(url, JSON.stringify(assignRole), {headers : tokenHeader});

  }

  updateUserInfo(user: User, newPassword: string, currentPassword: string) {
    let url = this.serverPath + "/user/updateUserInfo";
    let userInfo = {
      "id" : user.id,
      "firstName" : user.firstName,
      "lastName" : user.lastName,
      "username" : user.username,
      "currentPassword" : currentPassword,
      "email" : user.email,
      "newPassword" :newPassword
    };
console.log(userInfo);
    let tokenHeader = new Headers({
      'Content-Type' : 'application/json',
      'x-auth-token' : localStorage.getItem("xAuthToken")
    });
    return this.http.post(url, JSON.stringify(userInfo), {headers:tokenHeader});
  }

  retrievePassword(email:string) {

    let url = this.serverPath+'/user/forgetPassword';

  	let userInfo = {
  		"email" : email
  	}
  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem('xAuthToken')
  	});
    console.log(userInfo);
  	return this.http.post(url , userInfo , {headers:tokenHeader});
  }

  getCurrentUser() {
    let url = this.serverPath+'/user/getCurrentUser';

    let tokenHeader = new Headers({
      'Content-Type' : 'application/json',
      'x-auth-token' : localStorage.getItem('xAuthToken')
    });

    return this.http.get(url, {headers : tokenHeader});
  }

  getUserList(){
    let url = this.serverPath+'/user/getUserList';

    let tokenHeader = new Headers({
      'Content-Type' : 'application/json',
      'x-auth-token' : localStorage.getItem('xAuthToken')
    });

    return this.http.get(url, {headers : tokenHeader});
  }
    getRoleList(){
    let url = this.serverPath+'/user/getUserRoles';

    let tokenHeader = new Headers({
      'Content-Type' : 'application/json',
      'x-auth-token' : localStorage.getItem('xAuthToken')
    });

    return this.http.get(url, {headers : tokenHeader});
  }
  getRoleByUserId(userId:number){
    let url = this.serverPath+'/user/getUserRole/'+userId;

    let tokenHeader = new Headers({
      'Content-Type' : 'application/json',
      'x-auth-token' : localStorage.getItem('xAuthToken')
    });

    return this.http.get(url, {headers : tokenHeader});
  }

}
