
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
import { UserService } from 'src/app/services/user.service';
import { environment } from '../../../environments/environment';



@Component({
  selector: 'index-quizmaker',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexQuizFront implements OnInit {

  loggedIn:boolean;
  username : string;
  roleName : string;
  userid:number;
  quizCreator : number;
  quizCount : number=0;
  activityList :Activity[] =[];
  categoryList : Category[] =[];
  quizList:Quiz[]=[];
  surveyList:Quiz[]=[];
  activityLog : ActivityLog = new ActivityLog();
  quizRvw : number;
  quizInvg : number;
  qBankCountTotal : number =0;
  qBankCategoryMap : QBankCategoryMap = new QBankCategoryMap();
  qBankCategoryMapList : QBankCategoryMap[] =[];
  quizUserList:QuizUser[]=[];
  quizUser:QuizUser = new QuizUser();
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
  activeSurveyCount:number;
  upcomingSurveyCount:number;
  showAllMsgFlag=false;
  viewMoreResultRowFlg = false;
  quizUserListViewLess : QuizUser[]=[];
  env : string;

  eligibility: Eligibility=new Eligibility();

  rxjsTimer = timer(1000, 1000);

  constructor (private loginService: LoginService, private quizService:QuizService, private notificationService: ActivityLogService, private userService:UserService, private router: Router){

    this.quizService.getActivityList().subscribe(res =>{
        this.activityList = res.json();
console.log(this.activityList.length);
    });

    this.quizService.getCategoryList().subscribe(
      res => {
        console.log(res.json());
        this.categoryList=res.json();
      },
      err => {
        console.log(err);
      }
    );

    this.quizService.getQuizResultByUser(this.getWithExpiry("userId")).subscribe(
      res => {
        console.log(res.json());
        this.quizUserList=res.json();
        this.quizUserListViewLess = this.quizUserList.splice(0,6);
        console.log( this.quizUserListViewLess,this.quizUserList);
      },
      err => {
        console.log(err);
      }
    );

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

    this.quizService.getQuizList().subscribe(
      res => {
        console.log(res.json());
        this.quizList=res.json();
        this.quizCount = this.quizList.length;
       
      },
      err => {
        console.log(err);
      }
     
    );

    this.quizService.getSurveyList().subscribe(
      res => {
        console.log(res.json());
        this.surveyList=res.json();
      },
      err => {
        console.log(err);
      }
    );
    this.user.username = this.getWithExpiry("username");
    console.log(this.user.username);
    if(this.user.username == null){
 
     this.router.navigate(['/login']).then(s =>location.reload());;
 
    }

  }

  viewMoreRows(){
    this.viewMoreResultRowFlg = true;
  }
  showAllMsg(){
    this.showAllMsgFlag = true;
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
    var myArray = [
      "Apples",
      "Bananas",
      "Pears",
      "pineapple",
      "Guava","Melon","grapes","avogrdo"
    ];
    
    var randomArray=[];
    var n = 2;
do {
   console.log(n);
   randomArray.push(myArray[Math.floor(Math.random()*myArray.length)])
      
   randomArray = randomArray.filter((n, i) => randomArray.indexOf(n) === i);
   n--;
} while (randomArray.length != 2);
   
    console.log(randomArray);
   

    this.env = environment.environment;
    console.log(this.env,randomArray);
    this.checkSession();
    console.log( this.quizCount)
    
    this.username = this.getWithExpiry("username");
    this.userid = this.getWithExpiry("userId");
    console.log(this.username);
    this.getNotification();
    this.getQuestionBankCount();
    console.log(this.qBankCategoryMapList);
    let logFlag= false;
    this.loginService.checkSession().subscribe(
      res => {
        console.log(res["_body"]);
        logFlag=res["_body"];
        
      },
      error => {
        logFlag=false;
      }
    );
    this.loggedIn = logFlag;
    this.checkRole();
  //  this.quizCountPerUser();
console.log( this.loggedIn);

  }
 
  checkRole() {
  
    this.userService.getRoleByUserId(this.userid).subscribe(
      res => {
        this.roleName = res.json()[0].role.name;
        console.log(this.roleName);
              
      },
      error => {
        
      }
    );

  }
 /**  continueSession(){

    this.setWithExpiry("username", this.username, AppConst.sessionActive * 60*1000);
    this.setWithExpiry("userId",  this.userid , AppConst.sessionActive * 60*1000);

  }**/
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

  getProfileImage(){
    return AppConst.profileServerPath+this.userid+".png";
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

  getQuestionBankCount(){
    this.quizService.getQuestionBankCount().subscribe(
      res => {
          console.log(res.json());
          this.qBankCategoryMapList = res.json();
          this.qBankCategoryMapList.forEach(element => {
            this.qBankCountTotal+=element['questionBankcount'];
            console.log(element['questionBankcount'])
          });

         
          
      },
      err => console.log(err)
    );

    //console.log( this.qBankCountTotal);
  }


}
