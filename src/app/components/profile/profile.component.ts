import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { QuizUser } from 'src/app/models/QuizUser';
import { Eligibility } from 'src/app/models/Eligibility';
import { timer } from 'rxjs/internal/observable/timer';
import { LoginService } from 'src/app/services/login.service';
import { QuizService } from 'src/app/services/quiz.service';
import { ActivityLogService } from 'src/app/services/activity-log.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { ActivityLog } from 'src/app/models/ActivityLog';
import { DomSanitizer } from '@angular/platform-browser';
import { AppConst } from 'src/app/constants/app-const';

@Component({
    selector: 'profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
  })
  export class ProfileComponent implements OnInit {

    timer: number;
  user:User =new User();
  quizUser:QuizUser = new QuizUser();
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
  quizUserList:QuizUser[]=[];
  env : string;
  activityLog : ActivityLog = new ActivityLog();
  quizRvw : number;
  quizInvg : number;
  eligibility: Eligibility=new Eligibility();
  profImageFlag = false;
  rxjsTimer = timer(1000, 1000);
  userList : User[]=[];
  profileImage: any | ArrayBuffer =
  "https://bulma.io/images/placeholders/480x480.png";

  constructor (private loginService: LoginService, private sanitizer : DomSanitizer, private quizService:QuizService, private notificationService: ActivityLogService, private userService:UserService, private router: Router){

    
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

   
    
    this.user.username = this.getWithExpiry("username");
    console.log(this.user.username);
    if(this.user.username == null){
 
     this.router.navigate(['/login']).then(s =>location.reload());;
 
    }

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

  }


    ngOnInit(){
        this.getNotification();
        this.getUserInfo();
    }

    uploadEvent(event){
        this.profImageFlag = true;
        const file = (event.target as HTMLInputElement).files[0];
        this.profileImage = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
        console.log( this.profileImage );

        this.userService.addProfileImage(this.user.id,file).subscribe(res=>{
                    console.log("Image uploaded succesfully");
                    this.getProfileImage();
        },
            error => {
                console.log(error);
              }   
        )  

    }

    getUserInfo() {
        
       this.userService.getUserList().subscribe(res=>{
              this.userList = res.json();
              this.userList.forEach(user=>{
                  if(user.username ===  this.user.username ) {
                        this.user=user;

                  }

              });

       },
       err => console.log(err)
     );

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