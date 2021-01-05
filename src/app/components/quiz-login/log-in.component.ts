import { Component, OnInit } from '@angular/core';
import {LoginService} from "../../services/login.service";
import {AppConst} from '../../constants/app-const';
import {Router} from "@angular/router";
import { CookieService } from 'angular2-cookie/services/cookies.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class QuizLogInComponent implements OnInit {

  private serverzath = AppConst.serverPath;
  private loginError:boolean = false;
  private userNotFoundError : boolean = false;
  private loggedIn = false;
  private processing : boolean = false;
  private credential = {'username':'', 'password':''};
  private sessionMsgFlag : boolean;
  private sessionMsg : string;
  private rememberMe : boolean = false;

  constructor (private loginService: LoginService,private cookieService : CookieService, private router: Router){
    if(cookieService.get("remember")!==undefined){
      if(cookieService.get("remember") ==='Yes'){
        this.credential.username = this.cookieService.get("username");
        this.credential.password = this.cookieService.get("password");
        this.rememberMe = true;

      }


    }
  }

  onSubmit() {
    console.log(this.rememberMe);
    this.sessionMsgFlag = false;
    this.sessionMsg ='';
    localStorage.removeItem("msg");
    this.processing = true;
    console.log(this.credential.username, this.credential.password);
    this.loginService.login(this.credential.username, this.credential.password).subscribe(
      res=>{
        if(this.rememberMe){
          this.cookieService.put("remember" ,"Yes");
          this.cookieService.put("username" ,this.credential.username);
          this.cookieService.put("password" ,this.credential.password);

        } else{
          this.cookieService.put("remember" ,"No");
          this.cookieService.put("username" ,"");
          this.cookieService.put("password" ,"");
        }
        console.log(res['_body']);
        let status = res['_body'].toString();
        console.log(status.includes('login success'));
          if(status.includes('User Not Found')){
            this.processing = false;
            this.loggedIn=false;
            this.userNotFoundError = true;
            this.loginError = false;

           //this.router.navigate(['/login']).then(s =>location.reload());

          }

           if(status.includes('Invalid login')){

            this.processing = false;
            this.loggedIn=false;
            this.loginError = true;
            this.userNotFoundError = false;
           // this.router.navigate(['/login']).then(s =>location.reload());
          }

           if(status.includes('login success')){
            localStorage.setItem("xAuthToken",status.split(":")[1]);
            //localStorage.setItem("userId",status.split(":")[2]);
           // localStorage.setItem("username",this.credential.username);
            this.setWithExpiry("username", this.credential.username, AppConst.sessionActive * 60*1000);
            this.setWithExpiry("userId", status.split(":")[2], AppConst.sessionActive * 60*1000);

            this.processing = false;
            this.loggedIn=true;
            this.userNotFoundError = false;
            this.loginError = false;
            let url = localStorage.getItem("lastURL")!=null?localStorage.getItem("lastURL"):null;
            localStorage.removeItem("lastURL");
            if( url){
              console.log(localStorage.getItem("lastURL"));
              this.router.navigate([localStorage.getItem("lastURL")]).then(s =>location.reload());
              
            } else {
            this.router.navigate(['/index']).then(s =>location.reload());
            }

          }



          } , error=>{
        this.processing = false;
        this.loggedIn=false;
        this.loginError = true;
      }
    );

   /**   if (localStorage.getItem("xAuthToken") === 'undefined'){
      this.loggedIn=false;
      this.loginError=true;
      this.router.navigate(['/login']);
    }
    console.log(this.loggedIn+ localStorage.getItem("xAuthToken"));
**/

  }


  setWithExpiry(key, value, ttl) {
    const now = new Date()
  
    // `item` is an object which contains the original value
    // as well as the time when it's supposed to expire
    const item = {
      value: value,
      expiry: now.getTime() + ttl,
    }
    localStorage.setItem(key, JSON.stringify(item))
  }
  ngOnInit() {
   
    if(localStorage.getItem("msg")!=null){
      console.log(localStorage.getItem("msg"));
      this.sessionMsgFlag = true;
      this.sessionMsg = localStorage.getItem("msg");
    }
    this.loginService.checkSession().subscribe(
      res => {
        this.loggedIn=true;
      },
      error => {
        this.loggedIn=false;
      }
    );
  }

}
