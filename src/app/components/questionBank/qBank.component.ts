
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



@Component({
  selector: 'quiz-bank',
  templateUrl: './qBank.component.html',
  styleUrls: ['./qBank.component.css']
})
export class QuizBank implements OnInit {

  
  loggedIn:boolean;
  username : string;
  activityList :Activity[] =[];
  categoryList : Category[] =[];
  quizList:Quiz[]=[];
  activityLog : ActivityLog = new ActivityLog();
  quizRvw : number;
  quizInvg : number;
  qBankCountTotal : number =0;
  qBankCategoryMap : QBankCategoryMap = new QBankCategoryMap();
  qBankCategoryMapList : QBankCategoryMap[] =[];
  constructor (private loginService: LoginService, private quizService:QuizService, private notificationService: ActivityLogService, private router: Router){

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

    this.quizService.getQuizList().subscribe(
      res => {
        console.log(res.json());
        this.quizList=res.json();
      },
      err => {
        console.log(err);
      }
    );


  }

  ngOnInit() {
    this.username = localStorage.getItem("username");
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
console.log( this.loggedIn);

  }
  logout(){
    alert();
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
