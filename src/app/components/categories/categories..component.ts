import { QuizService } from '../../services/quiz.service';
import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/Category';
import { Audit } from 'src/app/models/Audit';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { Eligibility } from 'src/app/models/Eligibility';
import { ActivityLogService } from 'src/app/services/activity-log.service';
import { ActivityLog } from 'src/app/models/ActivityLog';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { AppConst } from 'src/app/constants/app-const';



declare let $: any;

@Component({
  selector: 'category-comp',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoryComponent implements OnInit {

  categoryList : Category[]=[];
  categoryObj : Category = new Category();
  categoryEditObj : Category = new Category();
  auditObj : Audit = new Audit();
  categoryIdDel : number;
  categoryTitleDel : string;
  user :any =[];
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

  eligibility: Eligibility=new Eligibility();


  constructor(private quizService:QuizService,private loginService : LoginService,private notificationService: ActivityLogService, private cookieService : CookieService, private router : Router) {

   this.user.username = localStorage.getItem('loginUser');

    this.quizService.getCategoryList().subscribe(
      res => {
        console.log(res.json());
        this.categoryList=res.json();
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

    this.user.username = this.getWithExpiry("username");
    console.log(this.user.username);
    if(this.user.username == null){
 
     this.router.navigate(['/login']).then(s =>location.reload());;
 
    }

  }
  setDeleteCategory(id,title){

    this.categoryTitleDel = title;
    this.categoryIdDel = id;

  }

  setUpdateCategory(category){

   console.log(category);
   this.updateFlag = true;
   this.categoryEditObj = category;


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


  deleteCategory(){

    this.quizService.deleteCategory(this.categoryIdDel).subscribe(
      res => {
       // console.log(res.json());
        this.message=res.json();
       
      },
      err => {
        console.log(err._body);
      //  this.cookieService.put("serverEr" ,err._body);
      }
    );
    location.reload();
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


  showAllMsg(){
    this.showAllMsgFlag = true;
  }

  ngOnInit() {
    console.log(this.cookieService.get("serverEr"));
    this.getNotification();
console.log(this.getWithExpiry("userId"));
    this.user.id = this.getWithExpiry("userId");

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

  setAddCategory(){
    this.updateFlag = false;
    this.categoryObj.category_title =null;
    this.categoryObj.category_desc = null;


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

  saveCategory(){

console.log(this.user);
console.log(this.categoryObj);
console.log(this.getWithExpiry("userId"));
this.auditObj.user = this.user;
this.auditObj.audit_event = this.categoryObj.category_title +" audit event";
this.auditObj.userId= this.getWithExpiry("userId");
this.categoryObj.audit = this.auditObj;
this.categoryEditObj.audit = this.auditObj;
console.log(this.categoryObj);
console.log("Update Flag: "+this.updateFlag);
if(this.updateFlag){

  this.quizService.updateCategory(this.categoryEditObj).subscribe(
    res => {
     // console.log(res.json());
      this.categoryList=res.json();
      this.updateFlag = false;
      //location.reload();
    },
    err => {
      console.log(err);
    }
  );

}else {
    this.quizService.saveCategory(this.categoryObj).subscribe(
      res => {
       // console.log(res.json());
        this.categoryList=res.json();
        location.reload();
      },
      err => {
        console.log(err);
      }
    );

    }
  }

     onSubmit(){

    }

}
