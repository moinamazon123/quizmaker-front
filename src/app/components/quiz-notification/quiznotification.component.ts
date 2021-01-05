
import { Category } from '../../models/Category';
import { Component, OnInit } from '@angular/core';
import { Activity } from 'src/app/models/Activity';
import { Quiz } from 'src/app/models/Quiz';
import { LoginService } from 'src/app/services/login.service';
import { QuizService } from 'src/app/services/quiz.service';
import { Router } from '@angular/router';
import { ActivityLogService } from 'src/app/services/activity-log.service';
import { ActivityLog } from 'src/app/models/ActivityLog';
import { QBankCategoryMap } from 'src/app/models/QBankCatMap';
import { Observable, Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppConst } from 'src/app/constants/app-const';
import { QuizUser } from 'src/app/models/QuizUser';
import { User } from 'src/app/models/user';
import { QuizDetails } from 'src/app/models/QuizDetails';
import { Eligibility } from 'src/app/models/Eligibility';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'quiz-notification',
  templateUrl: './quiznotification.component.html',
  styleUrls: ['./quiznotification.component.css']
})
export class QuizNotificationComponent implements OnInit {
  flag : string;

  loggedIn:boolean;
  username : string;
  userid:number;
  activityList :Activity[] =[];
  categoryList : Category[] =[];
  quizList:Quiz[]=[];
  activityLog : ActivityLog = new ActivityLog();
  quizRvw : number;
  quizInvg : number;

  destroy = new Subject();
  showDialog = false;
  timer: number;
  user:User =new User();
  dialog = 'stay logged in?';
  notice = 'session expired';
  showNotice = false;
  activeQuizCount : number;
  upcomingQuizCount : number;
  expiredQuizCount:number;
  activeSurveyCount : number;
  upcomingSurveyCount : number;
  eligibility: Eligibility=new Eligibility();

  rxjsTimer = timer(1000, 1000);


  constructor(private _Activatedroute:ActivatedRoute,private loginService: LoginService, private quizService:QuizService, private notificationService: ActivityLogService, private router: Router){
    this._Activatedroute.paramMap.subscribe(params => { 
      this.flag = params.get('flag'); 

      this.user.username = this.getWithExpiry("username");//localStorage.getItem("username");localStorage.getItem('loginUser');
      console.log(this.user.username);
      if(this.user.username == null){
   
       this.router.navigate(['/login']).then(s =>location.reload());;
   
      }


  }); 

  this.quizService.getEligibility(this.getWithExpiry("userId")).subscribe(
    res => {
      console.log(res.json());
      this.eligibility=res.json();
      this.activeQuizCount =  this.eligibility.activeQuizDetailsList.length;
      this.expiredQuizCount = this.eligibility.expiredQuizDetailsList.length;
      this.upcomingQuizCount = this.eligibility.upcomingQuizDetailsList.length;
      this.upcomingSurveyCount = this.eligibility.upcomingSurveyList.length;
      this.activeSurveyCount = this.eligibility.activeSurveyList.length;
    },
    err => {
      console.log(err);
    }
  );

  }

  getWithExpiry(key) {
    const itemStr = localStorage.getItem(key)
    // if the item doesn't exist, return null
    if (!itemStr) {
      return null
    }
    const item = JSON.parse(itemStr);
    const now = new Date()
    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
      // If the item is expired, delete the item from storage
      // and return null
          localStorage.removeItem(key)
          localStorage.setItem("msg","Session is Expired");
          console.log("Session Expired");
      return null
    }
    return item.value;
  }


  ngOnInit() {
    this.checkSession();

    this.username = this.getWithExpiry("username");
    this.userid = this.getWithExpiry("userId");
    console.log(this.username);
    this.getNotification();
    console.log( this.flag)
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

  getProfileImage(){
    console.log(this.checkImageExists(AppConst.profileServerPath+this.getWithExpiry("userId")+".png"));

    if(this.checkImageExists(AppConst.profileServerPath+this.getWithExpiry("userId")+".png"))
{
    return AppConst.profileServerPath+this.getWithExpiry("userId")+".png";
}
else
{
   return 'assets/img/boy.png';
}

  
}

  checkImageExists(imageUrl){
    
    /**
  * Checking if an image exist in your image folder
  */
  var request = new XMLHttpRequest();
  request.open('GET', imageUrl, false);
  request.send();
  let size : any = request.getAllResponseHeaders().toLowerCase().match(/content-length: \d+/);
  console.log(size);
  if(size.includes('content-length: 0')){
    
    return false;
  } else{
  return true;
  }
  }


  checkSession() {
    this.rxjsTimer.pipe(takeUntil(this.destroy)).subscribe(val => {
      this.timer = val;
    
      if (this.timer === 10) {
        this.showDialog = true;
      }
    
      if (this.timer >= AppConst.sessionActive * 60) {
      this.destroy.next();
      this.destroy.complete();
      this.showNotice = true;
      this.showDialog = false;
      }
    })
  }

 

  resetTimer(timer){

console.log(timer.timerreset);
this.timer = 0;
this.destroy.next();
this.destroy.complete();
this.showDialog = timer.showdialog;
this.checkSession();
  }

  logout(){
   
    this.loginService.logout().subscribe(
      res => {
        location.reload();
      },
      err => console.log(err)
    );
    // location.reload();
    this.router.navigate(['/']).then(s =>location.reload());;
  }

  getNotification(){
    this.notificationService.getActivityLog().subscribe(
      res => {
          console.log(res.json());
          this.activityLog = res.json();
          this.quizInvg  =this.activityLog.invigilatingQuiz.length;
          this.quizRvw = this.activityLog.reviewingQuiz.length;
          localStorage.setItem("rvwCount",this.activityLog.reviewingQuiz.length.toString());
          localStorage.setItem("invgCount",this.activityLog.invigilatingQuiz.length.toString());
          console.log(this.quizInvg , this.quizRvw)
      },
      err => console.log(err)
    );


  }


}