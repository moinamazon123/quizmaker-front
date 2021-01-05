import { Component, OnInit, Input, ViewChild } from '@angular/core';
import * as CanvasJS from './canvasjs.min.js';
import { ChartModel } from 'src/app/models/chartModel.js';

import { ActivityLogService } from 'src/app/services/activity-log.service';
import { Router } from '@angular/router';
import { ActivityLog } from 'src/app/models/ActivityLog';
import { LoginService } from 'src/app/services/login.service';
import { QuizService } from 'src/app/services/quiz.service';
import { Quiz } from 'src/app/models/Quiz.js';
import { Category } from 'src/app/models/Category';
import { Activity } from 'src/app/models/Activity';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppConst } from 'src/app/constants/app-const';
import { User } from 'src/app/models/user.js';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import  *  as  data  from  '../../country.json';
//var CanvasJS = require('./canvasjs.min');

@Component({
	selector: 'chart-comp',
	templateUrl: './chart.component.html'
})

export class ChartComponent implements OnInit {

  @Input('chartType') chartType : string ='both';
  @ViewChild('multiSelect',{ static: false }) multiSelect;
  public form: FormGroup;
 // @Input('dataPoints') dataPoints : ChartModel[]=[];
 dataPoint1:any={};
 dataPoint2:any={};
 dataPoints: any=[];

username : string;
userid:number;
quizRvw : number;
  quizInvg : number;
  activityList :Activity[] =[];
  categoryList : Category[] =[];
  category: Category=new Category();
  activity:Activity = new Activity();
  quizTitleList:any=[];
  user : User = new User();
  quiz:Quiz= new Quiz();
  quizList:Quiz[]=[];
  activityLog : ActivityLog = new ActivityLog();
  destroy = new Subject();
  showDialog = false;
  timer: number;
  dialog = 'stay logged in?';
  notice = 'session expired';
  showNotice = false;
  public settings = {};
  categorydata =[];
  rxjsTimer = timer(1000, 1000);
  public loadContent: boolean = false;
  dropdownList = [];
  selectedItems = [];
  requiredField: boolean = false
  countrydata: any = (data as any).default;
  quizid : number;
  states:any[]=[];

  constructor (private loginService: LoginService, private quizService:QuizService, private notificationService: ActivityLogService, private router: Router){

	this.getNotification();
    this.quizService.getActivityList().subscribe(res =>{
        this.activityList = res.json();
console.log(this.activityList.length);
    });


    this.quizService.getQuizList().subscribe(
      res => {
        console.log(res.json());
        this.quizList=res.json();
      },
      err => {
        console.log(err);
      }
    );

	this.quizService.getCategoryList().subscribe(
		res => {
		  console.log(res.json());
		  this.categoryList=res.json();
		
		},
		err => {
		  console.log(err);
		}
	  );


  }

  getResult(event){
	
 console.log(event.target.value);
   let dataPoints =[];

   this.quizService.getQuizByCategory(event.target.value).subscribe(
	res => {
		this.quizTitleList = res.json();
	},
	err => {
	  console.log(err);
	}
  );

  
 this.quizService.getResultByCategory(event.target.value).subscribe(
	res => {
	  console.log(res.json());
	  this.dataPoint1.y=res.json()['passCount'];
	  this.dataPoint1.label='PASS';
	  dataPoints.push(this.dataPoint1);
	  this.dataPoint2.y=res.json()['failCount'];
	  this.dataPoint2.label='FAIL';
	  dataPoints.push(this.dataPoint2);
	  this.dataPoints = dataPoints;
	  this.renderPie(this.dataPoints,event.target.value);
			this.renderBar(this.dataPoints,event.target.value);
			this.statewiseByCategory(event.target.value);
	},
	err => {
	  console.log(err);
	}
  );

console.log( dataPoints);
  }

  getQuizResult(event){

	this.quizid = event.target.value;
	let dataPoints =[];
	this.quizService.getResultByQuiz(event.target.value).subscribe(
		res => {
		  console.log(res.json());
		  this.dataPoint1.y=res.json()['passCount'];
		  this.dataPoint1.label='PASS';
		  dataPoints.push(this.dataPoint1);
		  this.dataPoint2.y=res.json()['failCount'];
		  this.dataPoint2.label='FAIL';
		  dataPoints.push(this.dataPoint2);
		  this.dataPoints = dataPoints;
		  this.renderPie(this.dataPoints,event.target.value);
				this.renderBar(this.dataPoints,event.target.value);
				this.statewiseByCategory(event.target.value);
		},
		err => {
		  console.log(err);
		}
	  );


  }

  populateState(){
    let stateList =[];
    let user:User=new User();
   user.country = this.user.country;
    this.countrydata.countries.forEach(function (value) {
      if(value['country'] === 'India'){
        stateList.push(value['states']);
      }
    });
    this.states = stateList[0];
    console.log( this.user.country, stateList[0].length);

  }

  cityWiseResult(event){

  let dataFailList =[];	let dataPassList =[];

	if(this.quizid!=null) {

	    
	  this.quizService.getCityWiseResultByQuizId(this.quizid,event.target.value).subscribe(
		 res => {
		   console.log(res.json());
		   res.json().forEach(element=>{
			if(element.passCount!=null) {
				
				let dataPass:any={};
				dataPass.y=element.passCount;
				dataPass.label=element.state;
				 dataPassList.push(dataPass);
				 console.log( dataPassList);
			}else{
				let dataFail:any={};
				dataFail.y=element.failCount;
				dataFail.label=element.state;
				dataFailList.push(dataFail);
				 console.log( dataFailList);
			}

		   });

				 this.renderMultiBar( dataPassList,dataFailList,'City');
		 },
		 err => {
		   console.log(err);
		 }
	   );
		} else {
			
			this.quizService.getCityWiseResultAll(event.target.value).subscribe(
				res => {
				  console.log(res.json());
				  res.json().forEach(element=>{
				   if(element.passCount!=null) {
					   let dataPass:any={};
					   dataPass.y=element.passCount;
					   dataPass.label=element.city;
						dataPassList.push(dataPass);
						console.log( dataPassList);
				   }else{
					   let dataFail:any={};
					   dataFail.y=element.failCount;
					   dataFail.label=element.city;
					   dataFailList.push(dataFail);
						console.log( dataFailList);
				   }
	   
				  });
	   
						this.renderMultiBar( dataPassList,dataFailList,'City');
				},
				err => {
				  console.log(err);
				}
			  );


		}
     


  }

  statewiseByCategory(categoryId){


	let dataFailList =[];	let dataPassList =[];
	    
	  this.quizService.getStatewiseResultByCategory(categoryId).subscribe(
		 res => {
		   console.log(res.json());
		   res.json().forEach(element=>{
			if(element.passCount!=null) {
				let dataPass:any={};
				dataPass.y=element.passCount;
				dataPass.label=element.state;
				 dataPassList.push(dataPass);
				 console.log( dataPassList);
			}else{
				let dataFail:any={};
				dataFail.y=element.failCount;
				dataFail.label=element.state;
				dataFailList.push(dataFail);
				 console.log( dataFailList);
			}

		   });

				 this.renderMultiBar( dataPassList,dataFailList,categoryId);
		 },
		 err => {
		   console.log(err);
		 }
	   );
	 

  }

  getAllResult(){
	
	
	  let dataPoints =[];
	 
	this.quizService.getAllQuizResult().subscribe(
	   res => {
		 console.log(res.json());
		 this.dataPoint1.y=res.json()['passCount'];
		 this.dataPoint1.label='PASS';
		 dataPoints.push(this.dataPoint1);
		 this.dataPoint2.y=res.json()['failCount'];
		 this.dataPoint2.label='FAIL';
		 dataPoints.push(this.dataPoint2);
		 this.dataPoints = dataPoints;
		 this.renderPie(this.dataPoints,"All");
			   this.renderBar(this.dataPoints,"All");
			  // this.renderMultiBar(this.dataPoints,"All");
	   },
	   err => {
		 console.log(err);
	   }
	 );
   
   console.log( dataPoints);
	 }

	 getStateWiseChart(){
	
	
		let dataFailList =[];	let dataPassList =[];
	    
	  this.quizService.getStateWiseQuizResult().subscribe(
		 res => {
		   console.log(res.json());
		   res.json().forEach(element=>{
			if(element.passCount!=null) {
				let dataPass:any={};
				dataPass.y=element.passCount;
				dataPass.label=element.state;
				 dataPassList.push(dataPass);
				 console.log( dataPassList);
			}else{
				let dataFail:any={};
				dataFail.y=element.failCount;
				dataFail.label=element.state;
				dataFailList.push(dataFail);
				 console.log( dataFailList);
			}

		   });

				 this.renderMultiBar( dataPassList,dataFailList,'All');
		 },
		 err => {
		   console.log(err);
		 }
	   );
	 

	   }



  populateCategories(){

	let categoryList =[];
	let categorydata :any =[];
    this.quizService.getCategoryList().subscribe(
		res => {
		  console.log(res.json());
		  categoryList=res.json();
		  categoryList = categoryList.filter(function( element ) {
			return element !== undefined;
		  });
		  console.log(categoryList);
		  for(let i=0;i<=categoryList.length;i++){
		  console.log(categoryList[i])
			let object = new Object();
			object["item_id"]=categoryList[i]!=undefined?categoryList[i].category_title:'NA';
			object["item_text"]=categoryList[i]!=undefined?categoryList[i].category_title:'NA';
			categorydata.push(object);
			
	  
			
		}
		},
		err => {
		  console.log(err);
		}
	  );

   this.categorydata=categorydata;
   console.log( this.categorydata);

  }

  public resetForm() {
    // beacuse i need select all crickter by default when i click on reset button.
    this.setForm();
    this.multiSelect.toggleSelectAll();
    // i try below variable isAllItemsSelected reference from your  repository but still not working
    // this.multiSelect.isAllItemsSelected = true;
  }
  public setForm() {
    this.form = new FormGroup({
      name: new FormControl(this.categorydata, Validators.required)
    });
    this.loadContent = true;
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

  


  ngOnInit() {
    this.checkSession();
	this.getAllResult();
	this.getStateWiseChart();
	this.populateState();
	
    this.username = this.getWithExpiry("username");
    this.userid = this.getWithExpiry("userId");

		
		if(this.chartType ==='pie'){
			this.renderPie(this.dataPoints,'');
		}
		if(this.chartType ==='column'){
			this.renderBar(this.dataPoints,'');
		}
		if(this.chartType ==='both'){
			this.renderPie(this.dataPoints,'');
			this.renderBar(this.dataPoints,'');
		}
	
		  
		  this.settings = {
			singleSelection: true,
			idField: 'item_id',
			textField: 'item_text',
			selectAllText: 'Select All',
			unSelectAllText: 'UnSelect All',
			itemsShowLimit: 3,
			allowSearchFilter: true
		  };
		  this.setStatus();
		 this.populateCategories();
		  
	}

	setStatus() {
		(this.selectedItems.length > 0) ? this.requiredField = true : this.requiredField = false;
	  }
	
renderPie(data,title){

	let chartTitle =(title==='All'?title:null);
	this.categoryList.forEach(category=>{
		if(category.category_id == title){
			chartTitle = category.category_title;
		}
	})

	let chart = new CanvasJS.Chart("chartContainer", {
		animationEnabled: true,
		exportEnabled: true,
		title: {
			text: "Result for "+chartTitle
		},
		width:500,
		data: [{
			type: "pie",
			dataPoints: data
		}]
	});

	chart.render();
	



}

renderBar(data,title){

	let chartTitle =(title==='All'?title:null);
	this.categoryList.forEach(category=>{
		if(category.category_id == title){
			chartTitle = category.category_title;
		}
	})
	let chart1 = new CanvasJS.Chart("chartContainer1", {
		animationEnabled: true,
		exportEnabled: true,
		title: {
			text: "Result for "+chartTitle
		},
		axisX:{
			gridColor: "white" ,
			gridThickness: 2        
		  },
		  axisY:{        
			interval: 15,
			gridColor: "white"
		  },
		width:500,
		data: [{
			type: "column",
			dataPoints: data
		}]
	});

	chart1.render();



}

renderMultiBar(dataPass,dataFail ,title){

	let chartTitle =(title==='All'?title:null);
	this.categoryList.forEach(category=>{
		if(category.category_id == title){
			chartTitle = category.category_title;
		}
	})

	let  chart = new CanvasJS.Chart("chartContainer2", {
		animationEnabled: true,
		title:{
			text:chartTitle
		},	
		axisY: {
			title: "State Wise Pass",
			titleFontColor: "#4F81BC",
			lineColor: "#4F81BC",
			labelFontColor: "#4F81BC",
			tickColor: "#4F81BC",
			gridColor: "white" ,
		},
		axisY2: {
			title: "State Wise Fail",
			titleFontColor: "#C0504E",
			lineColor: "#C0504E",
			labelFontColor: "#C0504E",
			tickColor: "#C0504E",
			gridColor: "white" ,
		},	
		toolTip: {
			shared: true
		},
		width:800,
		data: [{
			type: "column",
			name: "PASS",
			legendText: "PASS",
			showInLegend: true, 
			dataPoints:dataPass
		},
		{
			type: "column",	
			name: "FAIL",
			legendText: "FAIL",
			axisYType: "secondary",
			showInLegend: true,
			dataPoints:dataFail
		}]
	});
	chart.render();


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

}
