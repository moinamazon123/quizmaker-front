import { QuizService } from '../../services/quiz.service';
import { Component, OnInit } from '@angular/core';
import { Activity } from 'src/app/models/Activity';
import { Audit } from 'src/app/models/Audit';
import { User } from 'src/app/models/user';
import { ActivityLogService } from 'src/app/services/activity-log.service';
import { ActivityLog } from 'src/app/models/ActivityLog';
import { Eligibility } from 'src/app/models/Eligibility';
import { AppConst } from 'src/app/constants/app-const';
import { Observable, Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';



declare let $: any;

@Component({
  selector: 'activityLog-comp',
  templateUrl: './activityLog.component.html',
  styleUrls: ['./activityLog.component.css']
})
export class ActivityLogComponent implements OnInit {

  activityList : Activity[]=[];
  activityObj : Activity = new Activity();
  activityEditObj : Activity = new Activity();
  auditObj : Audit = new Audit();
  activityIdDel : number;
  activityTitleDel : string;
  user :User =new User();
  message : string;
  updateFlag : boolean ;
  activeQuizCount : number;
  upcomingQuizCount : number;
  expiredQuizCount:number;
  activeSurveyCount:number;
  upcomingSurveyCount:number;
  showAllMsgFlag=false;
  activityLog : ActivityLog = new ActivityLog();
  quizRvw : number;
  quizInvg : number;
  profImage:any;
  username:string;
  eligibility: Eligibility=new Eligibility();
  auditList : Audit[] =[];
  timer: number;
  
  dialog = 'stay logged in?';
  notice = 'session expired';
  showNotice = false;
  rxjsTimer = timer(1000, 1000);
  destroy = new Subject();
  showDialog = false;

  constructor(private quizService:QuizService , private notificationService : ActivityLogService) {

    this.profImage = this.getProfileImage();
    console.log(this.profImage);
    this.username = JSON.parse(localStorage.getItem('username'))['value'];
 
     this.quizService.getActivityList().subscribe(
       res => {
         console.log(res.json());
         this.activityList=res.json();
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

     this.notificationService.getActivityLog().subscribe(
      res => {
       this.auditList = res.json();
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
          console.log("Session Expired");
      return null
    }
    return item.value;
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

  setDeleteActivity(id,title){

    this.activityTitleDel = title;
    this.activityIdDel = id;

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

  setUpdateActivity(activity){

   console.log(activity);
   this.updateFlag = true;
   this.activityEditObj = activity;


  }

  deleteActivity(){

    this.quizService.deleteActivity(this.activityIdDel).subscribe(
      res => {
       // console.log(res.json());
        this.message=res.json();
      },
      err => {
        console.log(err);
      }
    );
location.reload();
  }



  ngOnInit() {
    this.getNotification();
  }

  buttonInRowClick(event: any): void {
    event.stopPropagation();
    console.log('Button in the row clicked.');
  }

  wholeRowClick(): void {
    console.log('Whole row clicked.');
  }

  nextButtonClickEvent(): void {
    //do next particular records like  101 - 200 rows.
    //we are calling to api

    console.log('next clicked')
  }
  previousButtonClickEvent(): void {
    //do previous particular the records like  0 - 100 rows.
    //we are calling to API
  }

  setAddActivity(){
    this.updateFlag = false;



  }


  saveActivity(){

console.log(this.user);
console.log(this.activityObj);


this.auditObj.audit_event = this.activityObj.activity_title +" audit event";
this.activityList.push(this.activityObj);
console.log(this.activityObj);
console.log(this.activityList);
console.log("Update Flag: "+this.updateFlag);
if(this.updateFlag){

  this.quizService.updateActivity(this.activityEditObj).subscribe(
    res => {
     // console.log(res.json());
      this.activityList=res.json();
    },
    err => {
      console.log(err);
    }
  );

}else {
    this.quizService.saveActivity(this.activityObj).subscribe(
      res => {
       // console.log(res.json());
        this.activityList=res.json();
      },
      err => {
        console.log(err);
      }
    );

    }
  }

  getProfileImage(){
   
    return AppConst.profileServerPath+this.getWithExpiry("userId")+".png";
}

     onSubmit(){

    }

}
