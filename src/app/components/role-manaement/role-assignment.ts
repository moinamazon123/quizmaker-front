import { Component, OnInit, ViewChild } from '@angular/core';
import { Activity } from 'src/app/models/Activity';
import { Category } from 'src/app/models/Category';
import { Quiz } from 'src/app/models/Quiz';
import { ActivityLog } from 'src/app/models/ActivityLog';
import { QuizService } from 'src/app/services/quiz.service';
import { LoginService } from 'src/app/services/login.service';
import { ActivityLogService } from 'src/app/services/activity-log.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { UserRole } from 'src/app/models/UserRole';
import { Role } from 'src/app/models/Role';
import { CompileShallowModuleMetadata } from '@angular/compiler';
import { AssignRole } from 'src/app/models/AssignRole';


@Component({
  selector: 'role-management',
  templateUrl: './role-assignment.html',
  styleUrls: ['./role-assignment.css']
})
export class RoleComponent implements OnInit {

    @ViewChild('multiSelect',{ static: false }) multiSelect;

    public form: FormGroup;
  public data = [];
  public settings = {};
  public selectedItems = [];
  public loadContent: boolean = false;
  assigneeUserIds:number[] =[];
  assigneeUserObj:any;
  userList:User[] =[];

    loggedIn:boolean;
    username : string;
    activityList :Activity[] =[];
    categoryList : Category[] =[];
    quizList:Quiz[]=[];
    activityLog : ActivityLog = new ActivityLog();
    quizRvw : number;
    user:User=new User();
    quizInvg : number;
    userRole : any =[];
    userRoleMap : UserRole[] =[];
    assignRole : AssignRole = new AssignRole();
    succMsg : any;
    erMsgFlag : boolean = false;
    succMsgFlag : boolean = false;
    roles : any =[];
    constructor (private loginService: LoginService, private quizService:QuizService, private notificationService: ActivityLogService, private router: Router,private userService : UserService){
        this.getNotification(); 

        this.user.username = this.getWithExpiry("username");
    console.log(this.user.username);
    if(this.user.username == null){
 
     this.router.navigate(['/login']).then(s =>location.reload());;
 
    }
       
      
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
	return item.value
}
    ngOnInit() {
     
       this.username = this.getWithExpiry("username")//localStorage.getItem("username");
console.log(this.username);
        let users : User[]=[];
      this.userService.getUserList().subscribe(
        res => {
          console.log(res.json());
          this.userList=res.json();
  
          console.log(this.userList[0].authorities[0].authority);
        },
        err => {
          console.log(err);
        }
  
    
  
    );

    let roles : Role[]=[] ;
    this.userService.getRoleList().subscribe(
      res => {
        console.log(res.json());
        this.roles=res.json();

      
        
      },
      err => {
        console.log(err);
      }
    );
      
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

      checkRole(event){
        this.succMsgFlag = false;
        this.userRole =[];
          console.log(event.target.value);
        this.userService.getRoleByUserId(event.target.value).subscribe(
            res => {
                this.userRoleMap = res.json();
                this.userRoleMap.forEach((params) => {
           
                    this.userRole.push(params.role['name']);
                    
                   });
                   console.log(this.userRole.toString());
              console.log(res.json()[0].role.name);
            },
            err => console.log(err)
          );
         

      }
      assignRoles(event){
            let roleIds=[];
            this.userRoleMap.forEach((params) => {
               if(params.role.roleId === Number(event.target.value)){
                    this.erMsgFlag = true;
               } else {
                this.erMsgFlag = false;
               }
               // roleIds.push(params.role.roleId);
               
              });
            console.log(roleIds);
              roleIds.push(Number(event.target.value));

              this.assignRole.roles=roleIds;
              console.log(this.assignRole);
       console.log(roleIds);
       if(!this.erMsgFlag) {
       this.userService.assignRole(this.assignRole).subscribe(
        res => {
            this.succMsg = res['_body'];
            this.succMsgFlag = true;
          console.log(res);
        },
        err => console.log(err)
      );
          }
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
    
      public setForm() {
        this.form = new FormGroup({
          name: new FormControl(this.data, Validators.required)
        });
        this.loadContent = true;
      }
    
      get f() { return this.form.controls; }
    
      public save() {
        console.log(this.form.value);
    this.assigneeUserObj = this.form.value;
    console.log(this.assigneeUserIds);
    
      }
    
      public resetForm() {
        // beacuse i need select all crickter by default when i click on reset button.
        this.setForm();
        this.multiSelect.toggleSelectAll();
        // i try below variable isAllItemsSelected reference from your  repository but still not working
        // this.multiSelect.isAllItemsSelected = true;
      }
    
      public onFilterChange(item: any) {
        console.log(item);
      }
      public onDropDownClose(item: any) {
        console.log(item);
      }
    
      public onItemSelect(item: any) {
        console.log(item);
      }
      public onDeSelect(item: any) {
        console.log(item);
      }
    
      public onSelectAll(items: any) {
        console.log(items);
      }
      public onDeSelectAll(items: any) {
        console.log(items);
      }
    
    }
    