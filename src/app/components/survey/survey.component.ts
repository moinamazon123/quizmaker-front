
import { QuestionType } from '../../models/QuestionType';
import { QuizService } from '../../services/quiz.service';
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';

import { FormGroup, Validator, Validators } from "@angular/forms";


import { ReplaySubject, Subject } from 'rxjs';
import { FormControl } from '@angular/forms';

import { take, takeUntil } from 'rxjs/operators';
import { Quiz } from 'src/app/models/Quiz';
import { Category } from 'src/app/models/Category';
import { Audit } from 'src/app/models/Audit';
import { Grade } from 'src/app/models/Grade';
import { User } from 'src/app/models/user';
import { Question } from 'src/app/models/Question';
import { Feedback } from 'src/app/models/Feedback';
import { QuizSetting } from 'src/app/models/QuizSetting';
import { Answers } from 'src/app/models/Answers';
import { UserService } from 'src/app/services/user.service';
import { Activity } from 'src/app/models/Activity';
import { Router } from '@angular/router';
import { BlobAnswer } from 'src/app/models/BlobAnswer';
import { LoginService } from 'src/app/services/login.service';
import { ActivityLogService } from 'src/app/services/activity-log.service';
import { ActivityLog } from 'src/app/models/ActivityLog';

import  *  as  data  from  '../../country.json';
import  *  as  citiesJson from  '../../indian-cities.json';
import { DomSanitizer } from '@angular/platform-browser';
import { BlobQuestionMap } from 'src/app/models/BlobQuestionMap';
import { Role } from 'src/app/models/Role';
import { HttpClient } from '@angular/common/http';
import { AppConst } from 'src/app/constants/app-const';
import { AnswerSeqMap } from 'src/app/models/AnswerSeqMap';

declare let $: any;

@Component({
  selector: 'survey-comp',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css'],
  providers: [QuizService]
})
export class SurveyComponent implements OnInit  {

  @ViewChild('multiSelect',{ static: false }) multiSelect;
  @ViewChild('videoPlayer',{ static: false } ) videoplayer: any;
  @ViewChild('audioOption',{ static: false }) audioPlayerRef: ElementRef;
  public startedPlay:boolean = false;
  public show:boolean = false;
  videoSource = null;//"http://localhost:4200/assets/short.mp4";//"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4";
audioSource = null;
  public form: FormGroup;
  public userdata = [];
  public citiesdata = [];
  public statesdata = [];
  public selectedStates = [];
  public selectedCities = [];
  public selectedRoles = [];
  public selectedInvig =[];
  public selectReviewerName =[];

  public settings = {};
  public settingSS = {};
  public selectedItems = [];
  public loadContent: boolean = false;
  comment : string ='';
  loggedInUser : number;
  countrydata: any = (data as any).default;
  citiesData : any = (citiesJson as any).default;
  requiredField: boolean = false;
  countriesdata:any[]=[];
  states:any[]=[];
  cities: any[] =[];
   citiesSelect = [];
   rolesdata =[];
   defaultRole=[];
   defaultCities=[];
   rolesSelect =[];
   quizTime:number;

  quizList : Quiz[]=[];
  roles : Role[]=[];
  categoryList : Category[]=[];
  activityList : Activity[]=[];
  category: Category=new Category();
  activity:Activity = new Activity();
  quizObj : Quiz = new Quiz();
  quizEditObj : Quiz = new Quiz();
  auditObj : Audit = new Audit();
  gradeObj: Grade = new Grade();
  //gradeObj :{[k: string]: any} = {};

  quizNotCreatedFlag = true;
  quizIdDel : number;
  quizTitleDel : string;
   deletedQSeq :any =[];
  user :User =new User();
  message : string;
  updateFlag : boolean ;
  inDesignFlag:boolean = false;
  editIntroFlag:boolean = false;
  editConcluFlag : boolean = false;
  questionTypeFlag : boolean = true ;
  questionFlag : boolean = true ;
  ansFlag : boolean = true ;
  blobFlag : boolean = false;
  blobQuestion : boolean = false;
  questionModalFlag:boolean = true;
  editQuestionModalFlag = false;
  activebuildFlag:boolean= true;
  activesettingFlag:boolean=false;
  activegradeFlag:boolean= false;
  activemanageFlag:boolean=false;
  activepublishFlag:boolean= false;
  activereportFlag:boolean=false;

  compbuildFlag:boolean= false;
  compsettingFlag:boolean=false;
  compgradeFlag:boolean= false;
  compmanageFlag:boolean=false;
  comppublishFlag:boolean= false;
  compreportFlag:boolean=false;

  todobuildFlag:boolean= false;
  todosettingFlag:boolean=false;
  todogradeFlag:boolean= false;
  todomanageFlag:boolean=false;
  todopublishFlag:boolean= false;
  todoreportFlag:boolean=false;

  questionTypeList : any = ['Single Select(Radio)', 'Single Select(Check Box)','Multi Select','Short Text','Fill Blanks','Video','Image','Audio','Image(Checkbox)'];
  questionType: string;
  colorList : any =['Green' ,'Cyan','Yellow','Blue','Gray','Magneta','Black'];
  fontFamily : any = ['Arial','fantasy','helvetica','cursive','Serif','Sans-serif','Monospace'];
  selectBoxStyles =['selectBoxNew','selectBoxOld','selectBoxResponsive'];
  radioBoxStyles =['radioBoxNew','radioBoxOld','radioBoxResponsive'];
  fontFaceList =['Arial Helvetica sans-serif','Courier, monospace','Times New Roman, Times, serif','Lucida Sans Unicode, Geneva, Verdana, sans-serif'];
  levelList =['Level 1','Level 2','Level 3','Level 4','Level 5'];
  lastDash : boolean=false;
  firstDash : boolean=false;
  radioValue :boolean;
  questionTye: QuestionType= new QuestionType();
  question : Question =new Question();
  questionObj:Question =new Question();
  editQuestionObj:Question =new Question();
  quizSettingObj :Quiz = new Quiz();
  maxAttemptList:any=[1,2,3,0];
  showAnsList: any=['Yes','No'];
  showScoreList: any=['Yes','No'];
  editQuestiionRow:number;
  questionList : Question[] =[];
  feedback : Feedback = new Feedback();
  quizSetting : QuizSetting = new QuizSetting();
  feedbackFlag : boolean = false;
  showAllMsgFlag = false;
  ans : Answers = new Answers();
  userList:User[] =[];
  userMap : Object=new Object();
  assigneeUserIds:number[] =[];
 
  assigneeCityList: any[]=[];
  assigneeRoleList : any[]=[];
  assigneeUserObj:any;
  ansList : Answers[] = [{ id: 0, question : null,response:'',correctAnswerFlag:false,blobAnswer:null,selected:false,responseSeq:0,blobUrl:null,surveyTextOption:false,surveyRatingOption:false,surveyText:null,rating:0}];
 // blobAnsList : BlobAnswer = new BlobAnswer();//File[] =[];
  ansFileList : File[] =[];
  blobAnswerSeqMapList : AnswerSeqMap[]=[];
  blobAnswerSet : BlobAnswer[]=[];
  
  blobQuestionObject:BlobQuestionMap[] =[];
  blobQuestionObjectUrl =[];
  ansRowIndex : number =0;
  imgValue:string;
  marked = false;
  theCheckbox = false;
  radioFlag = false;
  questionFrm;
  fileSizeEr : string;
  fileSizeErFlag : boolean = false;
  activityLog : ActivityLog = new ActivityLog();
  quizInvg  : number;
  quizRvw : number;
  

  file: File;
  imageUrl=null;
  blobQuestionUrl = null;
  blobAnswerUrl = null;
  imageUrl1: string | ArrayBuffer =
    "https://bulma.io/images/placeholders/480x480.png";
  fileName: string = "No file selected";
  ansImage:any=[];
  SchoolDetailsForm : FormGroup;
  QuestionDetailsForm : FormGroup;

  AllClassData=[
    {
    'className':'5th'
    },
   {
    'className':'8th'
   },
   {
    'className':'10th'
    },
   {
    'className':'12th'
   },
]    ;


  row = [
    {
      response : '',
      correct: ''
    }
  ];

  addQuestionSet(){

    const questObj = {
      id: 0, blobQuestion:null, answered:false ,question_type : null,question_mark:0,question_title:'',feedBack:null,responseList:[],audit:null,blobAnswer:[], questionSeq:0,blobUrl:null,blobObjectUrl:null
    }
    this.questionList.push(questObj);
  }

  addSurveyResponse(i) {
    const ansObj = {
      id: 0, question : null,response:'',correctAnswerFlag:false,blobAnswer:null,selected:false,responseSeq:0,blobUrl:null,surveyTextOption:false,surveyRatingOption:false,surveyText:null,rating:0
    }
    this.ansRowIndex+=1;
       let file : File;
   if( this.ansList.length ===0) {
    this.ansList.push(ansObj);
   }
   // this.blobAnsList.push(file);
    console.log( this.ansList);
  }

  editAnswerTable(editedQuestionIndex) {
    console.log(editedQuestionIndex);
    const ansObj = {
      id: 0, question : null,response:'',correctAnswerFlag:false,blobAnswer:null,selected:false,responseSeq:0,blobUrl:null,surveyTextOption:false,surveyRatingOption:false,surveyText:null,rating:0
    }
    this.quizObj.questionList.forEach(question =>{
      if(question.questionSeq === editedQuestionIndex){
        ansObj.responseSeq = question.responseList.length+1;
        ansObj.id = question.responseList.length+1;

        question.responseList.push(ansObj); // Add Answers to Selected Question
      }

    });
    console.log( this.quizObj.questionList);
    localStorage.setItem("questionSet",JSON.stringify( this.quizObj.questionList));
    //this.quizObj.questionList[editedQuestionIndex].responseList.push(ansObj);
  }
  goToSetting(){
     this.activebuildFlag = false;
     this.compbuildFlag = true;
     this.activesettingFlag = true;
     console.log(this.quizObj);
     console.log(this.blobAnswerSet);
     console.log(this.blobQuestionObject);
console.log(JSON.stringify(this.quizObj));
    /**  this.quizService.saveQuizWithQuestion(this.quizObj).subscribe(
      res => {
        this.quizObj = res.json();
       console.log(res.json());
      },
      err => {
        console.log(err);
      }
    );
**/
  }

  saveGrading(elm){
    console.log(this.gradeObj);
   this.quizObj.grade = elm;
   console.log(this.quizObj);
   this.clickTab('manage');
  }


prepareQuestionSet(){

  console.log(this.blobQuestionObjectUrl);
  console.log(this.blobQuestionObject);

  this.blobAnswerSet = this.blobAnswerSet.filter((thing, i, arr) => {
    return arr.indexOf(arr.find(t => t.questionSeq === thing.questionSeq)) === i;
  });// Distinct Items
  
console.log(this.blobAnswerSet);
  let questnSet = [];

 if(localStorage.getItem("questionSet")!=null){
   console.log(localStorage.getItem("questionSet"));
    if(JSON.parse(localStorage.getItem("questionSet")).length > 0) {
  var retrievedData = JSON.parse(localStorage.getItem("questionSet"));
  console.log(retrievedData);
  for(let i=0;i<=retrievedData.length;i++){
    //retrievedData[i].questionSeq= i+1;
    questnSet.push(retrievedData[i]);
     }
  }else {
    this.questionObj.questionSeq=1;
  }
} else {
  this.questionObj.questionSeq=1;
}
questnSet = questnSet.filter(function( element ) {
  return element !== undefined;
});

this.questionObj.responseList=this.ansList;

console.log(this.questionObj.responseList);
let answers : Answers[]=[];
for(let i =0;i<=this.questionObj.responseList.length;i++){
  if(this.questionObj.responseList[i]!=undefined){
    let answ =this.questionObj.responseList[i];
    answ.id =  i; 
    answ.responseSeq = i+1;
    answers.push(answ);
  }
    
}
this.questionObj.responseList= answers;

this.questionObj.feedBack = this.feedback;
let i =0;
if(this.deletedQSeq.length === 0) {

if(localStorage.getItem("questionSet")!=null && JSON.parse(localStorage.getItem("questionSet")).length > 0){
  var retrievedData = JSON.parse(localStorage.getItem("questionSet"));
  console.log(retrievedData.indexOf(retrievedData[retrievedData.length-1]));
  this.questionObj.questionSeq = questnSet.length+1;
}
 i = questnSet.length+1;

} else {
  this.questionObj.questionSeq = this.deletedQSeq[0];
   i =  this.questionObj.questionSeq;
}
this.deletedQSeq.shift();// removing first element of array
console.log("delete seq remaining",this.deletedQSeq);
this.blobQuestionObject.forEach(blobQMap =>{
  if(blobQMap.questionSeq == i){
    
    if(this.questionObj.question_type ==='Video') {
      this.questionObj.blobQuestion = blobQMap.file;
    this.questionObj.blobUrl =AppConst.serverPath+"/quizmaker/getVideo/"+this.quizObj.quizIndex+"/"+(questnSet.length+1)+"_Question_Video";
  }
  else if(this.questionObj.question_type ==='Audio') {
    this.questionObj.blobQuestion = blobQMap.file;
    this.questionObj.blobUrl =AppConst.serverPath+"/quizmaker/getAudio/"+this.quizObj.quizIndex+"/"+(questnSet.length+1)+"_Question_Audio.mp3";
  }
  else if(this.questionObj.question_type ==='Image'){
    this.questionObj.blobQuestion = blobQMap.file;
    this.questionObj.blobUrl =AppConst.serverPath+"/quizmaker/getImage/"+this.quizObj.quizIndex+"/"+(questnSet.length+1)+"_Question_Image.png";
   }else{
    this.questionObj.blobQuestion = null;
    this.questionObj.blobUrl =null;
   }
  }
});

console.log(this.blobAnswerSet);

 questnSet.push(this.questionObj);
 console.log("preparing question",this.questionObj)
 console.log(questnSet);

    localStorage.setItem("questionSet",JSON.stringify(questnSet));


//questnSet.push(question);
this.questionList = questnSet;
console.log(this.questionList);
this.quizObj.questionList = this.questionList;
//this.quizObj.id=null;
console.log(JSON.stringify(this.quizObj));
console.log("Sending quiz obj to persist ",this.quizObj);
/** this.quizService.saveQuizWithQuestion(this.quizObj).subscribe(
  res => {
  //  this.quizObj = res.json();
   console.log(res.json());
  },
  err => {
    console.log(err);
  }
); **/
console.log(this.quizObj);
//console.log(this.blobAnsList);
 localStorage.setItem("questionSet",JSON.stringify(this.quizObj.questionList));

}

  saveQuestion(questionForm :NgForm){
    console.log(this.QuestionDetailsForm.value);
if( this.validateForm()){
  console.log("Valid Form");
let question =new Question();
this.questionObj.responseList=this.ansList;
this.questionObj.feedBack = this.feedback;
question = this.questionObj;
console.log("Before adding Question :",this.questionList);
this.questionList.push(this.questionObj);
console.log("After fore adding Question :",this.questionList);
//this.questionList.splice(1,this.questionList.length-1);
//console.log(this.questionList);
this.quizObj.questionList = this.questionList;
//localStorage.setItem("questionList",this.questionList);
this.quizObj.id=null;
console.log(this.quizObj);

//this.compbuildFlag = true;
//this.questionModalFlag = false;

/** this.quizService.saveQuizWithQuestion(this.quizObj).subscribe(
  res => {
   // console.log(res.json());
    console.log(res.json());
  },
  err => {
    console.log(err);
  }
); **/

} else {
  console.log("Please enter mandatory fields");
  return false;
}

  }


  checkQuizCreatedByUser(loggedinuser:number){
    console.log(loggedinuser,this.quizList);
  this.quizList.forEach(quiz=>{

        if(loggedinuser == quiz.creator && quiz.activity.activity_id ===3){
          this.quizNotCreatedFlag = false;
        }

    })
    console.log( this.quizNotCreatedFlag);
      return this.quizNotCreatedFlag;
  }


  addQuestion(){
    console.log(this.quizObj);
    this.questionObj.question_type ='';
    this.feedback.feedback='';
    this.questionObj.question_title='';
    this.questionObj.question_mark=0;
    this.blobQuestionUrl ="https://bulma.io/images/placeholders/480x480.png";
    this.ansFileList=[];
    this.ansImage=[];
    this.ansList =[];
    this.ansFileList =[]
    this.editQuestionModalFlag = false;

  }

  validateForm(){

   let flag  = false;
   if(this.questionObj.question_type =='' || this.questionObj.question_type ==null){
   
  this.questionTypeFlag  = true;
flag  = false;


   } else {
     if(this.questionObj.question_type === 'Image(Checkbox)'){
     this.blobFlag = true;
     this.radioFlag= false;
     this.blobQuestion = false;
     }else if(this.questionObj.question_type === 'Single Select(Radio)'){
       this.radioFlag= true;
       this.blobFlag = false;
       this.blobQuestion = false;
     }else if( this.questionObj.question_type === 'Video' || this.questionObj.question_type === 'Audio' ||
     this.questionObj.question_type === 'Image'){
      this.radioFlag= false;
      this.blobFlag = false;
      this.blobQuestion = true;
    } else if (this.questionObj.question_type === 'Fill Blanks' ){

    
    
  }else {
      
      this.radioFlag= false;
      this.blobFlag = false;
      this.blobQuestion = false;
     }
    this.questionTypeFlag  = false;
    flag  = true;
   }
   if(this.questionObj.question_title=='' || this.questionObj.question_title ==null){
    this.questionFlag  = true;
    flag  = false;
     }else {
      this.questionFlag  = false;
      flag  = true;

     }
     if(this.ansList.length >0 ){
       if( this.ansList[0].response =='') {
      this.ansFlag  = true;
      flag  = false;
       } else {
        this.ansFlag  = false;
        flag  = true;
       }

       }
return flag;
  }

  toggleVisibility(e,i){
    //alert($(":checkbox").length);
    console.log(this.ansList[i].surveyTextOption);
    for(let i =0;i<=$(":checkbox").length;i++){
      this.ans = new Answers();
      this.ans.correctAnswerFlag = e.target.checked

    }
    for(let i =0;i<=$(":radio").length;i++){
      //alert();
      this.ans = new Answers();
      this.radioValue = true;
      this.ans.correctAnswerFlag = e.target.checked;

    }
    console.log(this.ans);
    console.log(e);
    this.marked= e.target.checked;
  }

  deleteRowOnEdit(responseSeq,responseList){
    console.log("You have selected ",responseSeq,responseList);


  }
  check(i){

    console.log( this.ansList[i].response);

  }
  deleteRow(ansSeq){
    
    console.log( ansSeq, this.ansList);
    var delBtn = confirm(" Do you want to delete this answer ?");
    

    if ( delBtn == true ) {
      this.ansList.splice(ansSeq, 1 );

      this.blobAnswerSet[0].answerBlob.forEach(file =>{
          if(file.responseSeq === ansSeq ){
            let index =  this.blobAnswerSet[0].answerBlob.indexOf(file);
            this.blobAnswerSet[0].answerBlob.splice(index, 1 );
          }
      })
      //this.ansFileList.splice(ansSeq, 1 );
    }
  

    console.log(this.quizObj.questionList);
  }
  deleteQuestionRow(i){
    console.log(i);
    this.deletedQSeq.push(i);
    const questObj = {
      id: 0, blobQuestion:null, answered:false ,question_type : null,question_mark:0,question_title:'',feedBack:null,responseList:[],audit:null,blobAnswer:[], questionSeq:0,blobUrl:null,blobObjectUrl:null
    }
console.log( "Before delete :",this.quizObj.questionList);
    //this.quizObj.questionList.splice(i, 1 );
    this.quizObj.questionList.forEach(questionDelete =>{
   if(questionDelete.questionSeq === i){
    let index = this.quizObj.questionList.indexOf(questionDelete);
    this.quizObj.questionList.splice(index, 1 );
   // this.quizObj.questionList.push(questObj);
   }
    });
    // Deleting Blob Object 

    this.blobQuestionObject.forEach(fileBlob =>{

      if(fileBlob.questionSeq === i){
        let index =  this.blobQuestionObject.indexOf(fileBlob);
        this.blobQuestionObject.splice(index, 1 );
      }

    });

 

    console.log(this.deletedQSeq);

    console.log( "After delete Question:",this.quizObj.questionList);
    console.log( "After delete Question Object:",this.blobQuestionObject);
    localStorage.setItem("questionSet",JSON.stringify( this.quizObj.questionList));
}
editQuestionRowModal(i){
console.log(this.quizObj.questionList ,i);

this.quizObj.questionList.forEach(question =>{
    if(question.id === i){
      this.editQuestionObj = question;
    }

});



 // this.editQuestionObj = this.quizObj.questionList[i-1];
  this.editQuestiionRow = i;
  this.editQuestionModalFlag = true;
  this.questionType = this.editQuestionObj.question_type;// this.questionTypeList[i-1];
  //this.blobQuestionUrl = this.blobQuestionObjectUrl[i-1];
  console.log(this.editQuestionObj);
 

}
editQuestionSet(i){
  let questnSet = [];
  if(localStorage.getItem("questionSet")!=null){
    var retrievedData = JSON.parse(localStorage.getItem("questionSet"));
    for(let i=0;i<=retrievedData.length;i++){
      questnSet.push(retrievedData[i]);
    }

  }
  questnSet = questnSet.filter(function( element ) {
    return element !== undefined;
  });
  console.log(questnSet);
  console.log(this.editQuestionObj);
  this.quizObj.questionList = questnSet;

  this.quizObj.questionList.forEach(question =>{
    if(question.questionSeq === i){
     let index = this.quizObj.questionList.indexOf(question);
    this.quizObj.questionList.splice(index, 1 ); // Deleting Old  Question Based On sequence number
    }

});

  //this.quizObj.questionList.splice(i, 1 ); // Deleting Editing Question
  this.quizObj.questionList.push(this.editQuestionObj); // Add Edited Question in its sequence
  console.log(this.quizObj.questionList);

}

  constructor(private httpClient:HttpClient ,private sanitizer : DomSanitizer,private quizService:QuizService , private notificationService : ActivityLogService, private userService:UserService ,fb: FormBuilder , private router : Router , private loginService: LoginService) {
  
   let users : User[]=[];
    this.userService.getUserList().subscribe(
      res => {
        console.log(res.json());
        this.userList=res.json();

        for(let i=0;i<=this.userList.length;i++){
          let object = new Object();
          object["item_id"]=this.userList[i].id;
          object["item_text"]=this.userList[i].username;
          this.userMap[this.userList[i].id]=this.userList[i].username;
          this.userdata.push(object);

      }
        console.log(this.userList[0].authorities[0].authority);
      },
      err => {
        console.log(err);
      }

    /**this.gradeObj.gradeAHeader=null;
    this.gradeObj["gradeA"]=95;
    this.gradeObj["gradeAPlusHeader"]="A+";
    this.gradeObj["gradeAPlus"]=98;
    this.gradeObj["gradeAMinusHeader"]="A-";
    this.gradeObj["gradeAMinus"]=98;
    this.gradeObj["gradeBPlusHeader"]="B+";
    this.gradeObj["gradeBPlus"]=98;
    this.gradeObj["gradeBHeader"]="B";
    this.gradeObj["gradeB"]=98;
    this.gradeObj["gradeBMinusHeader"]="B-";
    this.gradeObj["gradeBMinus"]=91;
    this.gradeObj["gradeCPlusHeader"]="C+";
    this.gradeObj["gradeCPlus"]=95;
    this.gradeObj["gradeCMinusHeader"]="C-";
    this.gradeObj["gradeCMinus"]=80;
    this.gradeObj["gradeDPlusHeader"]="D+";
    this.gradeObj["gradeDPlus"]=70;
    this.gradeObj["gradeDHeader"]="A";
    this.gradeObj["gradeD"]=60;
    this.gradeObj["gradeDMinusHeader"]="D-";
    this.gradeObj["gradeDMinus"]=98;
    this.gradeObj["gradeCHeader"]="C";
    this.gradeObj["gradeC"]=98; **/

    );



    this.questionFrm = fb.group({
      answer: this.ans,
      question : this.question,
      feedback : this.feedback,
      ansList : this.ansList

    })
    this.feedbackFlag = false;
   this.user.username = this.getWithExpiry("username");//localStorage.getItem("username");localStorage.getItem('loginUser');
   console.log(this.user.username);
   if(this.user.username == null){

    this.router.navigate(['/login']).then(s =>location.reload());;

   }


    this.quizService.getSurveyList().subscribe(
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


    this.quizService.getActivityList().subscribe(
      res => {
        console.log(res.json());
        this.activityList=res.json();
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

  saveSurvey(settingquiz:Quiz){
    console.log(settingquiz);
   
    console.log(this.assigneeUserIds.join(','));
     console.log(this.quizSettingObj);
     this.quizObj.surveyIndex = this.quizObj.surveyIndex!=null?this.quizObj.surveyIndex:this.quizList.length +1;
     this.quizObj.creator = Number(localStorage.getItem("userId"));
     this.quizObj.status ='Published';
this.quizObj.date_schedule = this.quizSettingObj.date_schedule;

this.quizObj.assigneeCityList = this.assigneeCityList.length>0?this.assigneeCityList.toString():
                              (this.quizObj.assigneeCityList.length>0?
                                this.quizObj.assigneeCityList.toString():null);
this.quizObj.assigneeRoleList = this.assigneeRoleList.length>0?this.assigneeRoleList.toString():
                                (this.quizObj.assigneeRoleList.length>0?
                                  this.quizObj.assigneeRoleList.toString():null);
 console.log(this.quizObj);
console.log(JSON.stringify(this.quizObj));

this.quizService.saveSurveyWithOption(this.quizObj).subscribe(
  res => {
    console.log(res.json());
   this.quizObj = res.json();
   console.log(res.json());
   
  
    this.clickTab('publish');
  },
  err => {
    console.log(err);
  }
);



  }

  resetQuestionModal(){

    this.ansList=[];
    this.question.question_mark=null;
    this.question.question_title = null;
    this.question.question_type =null;
    this.question.responseList=this.ansList;
    this.questionList=null;
    this.feedback.feedback = null;
    this.feedbackFlag = false;

    this.quizObj.questionList = this.questionList;
console.log(this.quizObj);


  }


  setDeleteQuiz(id,title){

    this.quizTitleDel = title;
    this.quizIdDel = id;

  }

  setUpdateActivity(activity){

   console.log(activity);
   this.updateFlag = true;
   this.quizEditObj = activity;


  }

  feedBackArea(){
this.feedbackFlag = true;
this.editQuestionObj =new Question();

  }

  showAllMsg(){
    this.showAllMsgFlag = true;
  }

  deleteSurvey(){

    this.quizService.deleteSurvey(this.quizIdDel).subscribe(
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

  inDesign(quiz:Quiz){
    this.selectedCities=[];
    this.selectedStates =[];
    this.selectedRoles =[];
    this.quizObj =quiz;
    this.quizSettingObj = quiz;
    this.gradeObj = quiz.grade!=null ?quiz.grade:new Grade();
    this.quizSetting = quiz.quizSetting!=null ? quiz.quizSetting:new QuizSetting();
    this.quizSettingObj.scheduleDateTime=quiz.date_schedule+"T"+quiz.time_schedule;//"2020-10-17T23:48";
   if(quiz.assigneeCityList!=null && quiz.assigneeCityList.split(',').length>0) {
     this.populateDefaultCitiesList(quiz.assigneeCityList.split(','));
   }
   if(quiz.assigneeStateList!=null && quiz.assigneeStateList.split(',').length>0){
    this.populateDefaultStateList(quiz.assigneeStateList.split(','));
   }
   if(quiz.assigneeRoleList!=null && quiz.assigneeRoleList.split(',').length>0) {
    this.populateDefaultRolesList(quiz.assigneeRoleList.split(','));
   }
   if(quiz.invigilator!=0){
    let object= new Object();
    object["item_id"]=quiz.invigilator;
    object["item_text"]=this.userMap[quiz.invigilator];
       this.selectedInvig.push(object);
       console.log( this.selectedInvig);
   }
   if(quiz.reviewer!=0){
    let object= new Object();
    object["item_id"]=quiz.reviewer;
    object["item_text"]= this.userMap[quiz.reviewer];
       this.selectReviewerName.push(object);
       console.log( this.selectReviewerName);
   
}
    let empty =[];
    localStorage.setItem("questionSet",this.quizObj.questionList!=null?JSON.stringify(this.quizObj.questionList):JSON.stringify(empty));
console.log(quiz);
this.inDesignFlag = true;
this.activebuildFlag = true;

  }

 

  populateDefaultCitiesList(cities){

    cities.forEach(element => {
      let object= new Object();
      object["item_id"]=element;
      object["item_text"]=element;
      this.selectedCities.push(object);
    });
console.log( this.selectedCities);
  }
  populateDefaultStateList(states){

    states.forEach(element => {
      let object= new Object();
      object["item_id"]=element;
      object["item_text"]=element;
      this.selectedStates.push(object);
    });
console.log( this.selectedStates);
  }
  populateDefaultRolesList(roles){

    roles.forEach(element => {
      let object= new Object();
      object["item_id"]=element;
      object["item_text"]=element;
      this.selectedRoles.push(object);
    });
console.log( this.selectedRoles);
  }

  backQuizList(){
    this.inDesignFlag = false;
    this.activemanageFlag = false;
    this.activesettingFlag = false;
    this.activepublishFlag = false;
    this.activegradeFlag = false;

  }

  edit(elm){
    if(elm === 'Intro'){
      this.editIntroFlag = true;
     // this.editConcluFlag = false;
    }
    if(elm === 'Conclu'){
     // this.editIntroFlag = false;
      this.editConcluFlag = true;
    }
  }
  update(elm){
    console.log(this.quizObj);
    if(elm === 'Intro'){
      this.editIntroFlag = false;
    //  this.editConcluFlag = true;
    }
    if(elm === 'Conclu'){
      //this.editIntroFlag = true;
      this.editConcluFlag = false;
    }

  }

  cancel(elm){
if(elm === 'Intro'){
  this.editIntroFlag = false;
//  this.editConcluFlag = true;
}
if(elm === 'Conclu'){
  //this.editIntroFlag = true;
  this.editConcluFlag = false;
}

  }

checkSession(){
let isActive : boolean;
  this.quizService.checkSession().subscribe(
    res => {
    isActive = res["_body"];
    console.log(isActive);
    },
    err => {
      console.log(err);
    }
  );

    return isActive;
}

getRoleList(){

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


}



  ngOnInit() {
   
    this.getNotification();
   this.loggedInUser =  this.getWithExpiry("userId");
    //localStorage.removeItem("questionSet");
    localStorage.setItem("questionSet",JSON.stringify(null));
    this.addQuestionSet();
    this.feedbackFlag = false;
    this.ans.correctAnswerFlag =false;

    console.log(this.quizObj);


    console.log(this.userList);

console.log( this.userdata);

    // setting and support i18n
    this.settings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      enableCheckAll: true,

      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 3,

      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false
    };

    this.settingSS = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      enableCheckAll: true,

      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 3,

      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false
    };


    this.setForm();
/** Populate Geo Data  */
    let countryList=[];
    let stateList =[];
    this.countrydata.countries.forEach(function (value) {
      countryList.push(value['country']);
      
    }); 
    this.countriesdata = countryList;
    this.states = stateList;
    console.log(  countryList,stateList);
    this.populateState();
    this.defaultRole = [
      { "item_id": 7, "item_text": "GUEST" }
     
    ]
    this.defaultCities = [
      { "item_id": 7, "item_text": "BHubaneswar" }
     
    ]
    this.populateRoles();
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

   

    for(let i=0;i<=stateList[0].length;i++){
      let object = new Object();
      object["item_id"]=i+1;
      object["item_text"]=stateList[0][i];
      this.statesdata.push(object);

  }

    this.states = stateList[0];
    console.log( this.user.country, stateList[0].length);

  }

  selectReviewer(item: any){
    this.quizSettingObj.reviewer = item.item_id; 

  }
unselectReviewer(item: any){
  this.quizSettingObj.reviewer = null; 

}
selectInvigilator(item: any){
  this.quizSettingObj.invigilator = item.item_id; 

}
unselectInvigilator(item: any){
this.quizSettingObj.invigilator= null; 

}

  populateCities(item: any){

    console.log(item);
    let cityList =[];
    this.citiesdata =[];
   let citiesArrays=[];
    let user:User=new User();
    this.citiesSelect.push(item.item_text);
    console.log(this.citiesSelect);
    citiesArrays = this.citiesSelect
   user.state = this.user.state;
    this.citiesData.forEach(function (value) {
  
      if(citiesArrays.includes(value['state'])){
        cityList .push(value['name']);
      }

    });
    this.cities = cityList;

    for(let i=0;i<=cityList.length;i++){
      let object = new Object();
      object["item_id"]=i+1;
      object["item_text"]=cityList[i];
      this.citiesdata.push(object);

  }
     
  this.citiesdata =  this.citiesdata.filter(function( element ) {
    return element !== undefined;
  });

    console.log( this.citiesdata);

  }

  resetRoleCity(){

    this.selectedRoles=[] ;
    this.selectedCities=[] ;
    this.selectedStates=[];

  }
  
  deSelectCities(item:any){

    const index: number =  this.citiesSelect.indexOf(item.item_text);
    if (index !== -1) {
      this.citiesSelect.splice(index, 1); // delete the de select state
    } 

    console.log(item);
    let cityList =[];
    this.citiesdata =[];
   let citiesArrays=[];
    let user:User=new User();
   
    console.log(this.citiesSelect);
    citiesArrays = this.citiesSelect
   user.state = this.user.state;
    this.citiesData.forEach(function (value) {
  
      if(citiesArrays.includes(value['state'])){
        cityList .push(value['name']);
      }

    });
    this.cities = cityList;

    for(let i=0;i<=cityList.length;i++){
      let object = new Object();
      object["item_id"]=i+1;
      object["item_text"]=cityList[i];
      this.citiesdata.push(object);

  }
     
  this.citiesdata =  this.citiesdata.filter(function( element ) {
    return element !== undefined;
  });

    console.log( this.citiesdata);

  }
  

  populateRoles(){
    let roles : Role[]=[] ;
    let rolesdata =[];
  this.userService.getRoleList().subscribe(
    res => {
    //  console.log(res.json());
     roles=res.json();
      console.log(roles);


    for(let i=0;i<=roles.length;i++){
      let object = new Object();
     // object["item_id"]=roles[i].roleId;
      object["item_id"]=roles[i]['name'];
      object["item_text"]=roles[i]['name'];
      rolesdata.push(object);

  }
      
    },
    err => {
      console.log(err);
    }
  );

  this.rolesdata = rolesdata;
  
    console.log(  this.rolesdata);

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

  setAddQuiz(){
    this.updateFlag = false;



  }
  SaveData()
  {
    console.log(this.SchoolDetailsForm.value);
    //pass this data to service and api node/webapi

  }

changeToMin(){

  this.quizTime = this.quizSettingObj.time / 60 ;

}


  savePoll(){
console.log(this.quizObj.quizIndex);
this.quizObj.creator = this.getWithExpiry("userId");
this.quizObj.surveyIndex = this.quizList.length+1;
this.quizObj.activity = this.activity;
this.quizObj.status ='In_Design';
console.log(this.quizObj);
console.log("Update Flag: "+this.updateFlag);
if(this.updateFlag){

   this.quizService.saveQuiz(this.quizEditObj).subscribe(
    res => {
      console.log(res.json());
    // this.quizList=res.json();
    },
    err => {
      console.log(err);
    }
  );

}else {
    this.quizService.saveQuiz(this.quizObj).subscribe(
      res => {
       console.log(res.json());
        //this.quizList=res.json();
      },
      err => {
        console.log(err);
      }
    );

    }
/**  To refresh the poll List **/
    this.quizService.getSurveyList().subscribe(
      res => {
        console.log(res.json());
        this.quizList=res.json();
      },
      err => {
        console.log(err);
      }
    );
    this.router.navigate(['/survey']).then(s =>location.reload());
  }


  public setForm() {
    this.form = new FormGroup({
      name: new FormControl(this.citiesdata, Validators.required)
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

  public onDeSelect(item: any) {
    console.log(item);
  }

  public onCitySelect(item: any) {
    if(this.quizObj.assigneeCityList!=null){
      this.assigneeCityList = this.quizObj.assigneeCityList.split(",");
      if(!this.assigneeCityList.includes(item.item_text)){
        this.assigneeCityList.push(item.item_text);
      }
    } else {
    this.assigneeCityList.push(item.item_text);
    }
    console.log( this.assigneeCityList);
  }
  public onCityDeSelect(item: any) {

    if(this.quizObj.assigneeCityList!=null){
      this.assigneeCityList = this.quizObj.assigneeCityList.split(",");

    }
    const index: number =  this.assigneeCityList.indexOf(item.item_text);
    if (index !== -1) {
      this.assigneeCityList.splice(index, 1); // delete the de select state
    } 

    console.log( this.assigneeCityList);
  }

  public onRoleSelect(item: any) {
    this.assigneeRoleList.push(item.item_id);
    console.log( this.assigneeRoleList);
  }
  public onRoleDeSelect(item: any) {

    const index: number =  this.assigneeRoleList.indexOf(item.item_id);
    if (index !== -1) {
      this.assigneeRoleList.splice(index, 1); // delete the de select state
    } 
    console.log( this.assigneeRoleList);
  }

  public onSelectAll(items: any) {
    console.log(items);
  }
  public onDeSelectAll(items: any) {
    console.log(items);
  }

/** Click Tab */

clickTab(elm){
 if(elm ==='build'){
   this.activebuildFlag = true;
this.activesettingFlag = false;
this.activegradeFlag = false;
this.activepublishFlag = false;
this.activereportFlag = false;
this.activemanageFlag = false;

 }
 if(elm ==='setting'){
  this.activebuildFlag = false;
this.activesettingFlag = true;
this.activegradeFlag = false;
this.activepublishFlag = false;
this.activereportFlag = false;
this.activemanageFlag = false;
this.compbuildFlag = true;

}
if(elm ==='grade'){
  this.activebuildFlag = false;
this.activesettingFlag = false;
this.activegradeFlag = true;
this.activepublishFlag = false;
this.activereportFlag = false;
this.activemanageFlag = false;
this.compsettingFlag = true;

}
if(elm ==='publish'){
  this.activebuildFlag = false;
this.activesettingFlag = false;
this.activegradeFlag = false;
this.activepublishFlag = true;
this.activemanageFlag = false;
this.activereportFlag = false;
this.compmanageFlag = true;

}
if(elm ==='report'){
  this.activebuildFlag = false;
this.activesettingFlag = false;
this.activegradeFlag = false;
this.activepublishFlag = false;
this.activemanageFlag = false;
this.activereportFlag = true;

}

if(elm ==='manage'){
  this.activebuildFlag = false;
this.activesettingFlag = false;
this.activegradeFlag = false;
this.activepublishFlag = false;
this.activemanageFlag = true;
this.activereportFlag = false;
this.compgradeFlag = true;

}


}

uploadAnswerObject(event,responseSeq){
  let blobAnswerMap : AnswerSeqMap=new AnswerSeqMap();
  console.log(this.ansFileList);
  console.log(responseSeq);
  console.log(this.quizObj.questionList);
  const file = (event.target as HTMLInputElement).files[0];
  blobAnswerMap.responseSeq = responseSeq;
  blobAnswerMap.file = file;
  this.blobAnswerSeqMapList.push(blobAnswerMap);
  this.ansFileList.push(file);
  let blobAnswer : BlobAnswer = new BlobAnswer() ;
  blobAnswer.answerBlob = this.blobAnswerSeqMapList;
  //blobAnswer.reponseSeq = responseSeq;
  blobAnswer.questionSeq = this.quizObj.questionList.length+1;
  this.blobAnswerSet.push(blobAnswer);

  //this.blobAnswerUrl =  this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.ansFileList[responseSeq]));

  console.log(this.blobAnswerSet);
  
  
}

getAnswerBlob(responseSeq,questionSeq ){
  console.log(this.blobAnswerSet);
  console.log(questionSeq,responseSeq);
    let blobUrl=null;
  this.blobAnswerSet.forEach(blobAnsw =>{

    if(blobAnsw.questionSeq === questionSeq  ) {
        blobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blobAnsw.answerBlob[responseSeq-1].file));
    } else{
      blobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.ansFileList[responseSeq]));
    }


  });

 
  return blobUrl;
// return  this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.ansFileList[responseSeq]));

}

getBlobQuestionUrl(editQuestionObject : Question,questionSeq:number){
  console.log(editQuestionObject,questionSeq);
    let blobUrl = null;
    if(this.blobQuestionObject.length>0){

      this.blobQuestionObject.forEach(fileBlob =>{
          if(fileBlob.questionSeq === questionSeq){
            alert();
            blobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(fileBlob.file));

          } else {
            blobUrl = editQuestionObject.blobUrl;
          }

      });

    } else {

      blobUrl = editQuestionObject.blobUrl;
    }
console.log(blobUrl);
return blobUrl;
}


uploadQuestionObject(event,questionSeq){
  console.log(questionSeq);
  console.log("Adding file to ", this.questionObj);
  const file = (event.target as HTMLInputElement).files[0];
 
 let blobQuestionMap: BlobQuestionMap = new  BlobQuestionMap() ;

if(questionSeq!=null && questionSeq!=undefined ){

  this.blobQuestionObject.forEach(updateblob => {
    if(updateblob.questionSeq === questionSeq){
      let index =  this.blobQuestionObject.indexOf(updateblob);
      this.blobQuestionObject.splice(index, 1 );
      this.blobQuestionUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
      blobQuestionMap.file = file;
      blobQuestionMap.questionSeq = questionSeq;
      this.blobQuestionObject.push(blobQuestionMap);

    }

  });

} else {


  // not really needed in this exact case, but since it is really important in other cases,
  // don't forget to revoke the blobURI when you don't need it
 

  //this.blobQuestionObject.push(file);
  console.log((event.target as HTMLInputElement).files[0].size/1024/1024 + ' MB');
  if((event.target as HTMLInputElement).files[0].size/1024/1024 > 15){
    this.fileSizeEr = "File size should less or equal to 15 MB";
    this.fileSizeErFlag = true;
  } else {
    this.fileSizeEr = "";
    this.fileSizeErFlag = false;
  }

  if (file) {
    this.fileName = file.name;
    this.file = file;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event: any) => {
    // this.audioSource =   URL.createObjectURL(file);//event.target.result;
      this.imageUrl =  this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));//reader.result;
      this.videoSource = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
      this.audioSource = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
      this.blobQuestionUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
      console.log(this.videoSource );
      console.log(this.audioSource );
      this.blobQuestionObjectUrl.push(this.quizObj.questionList.length+1+"_"+this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file)));
    };
   
    blobQuestionMap.file = file;
    blobQuestionMap.questionSeq = this.quizObj.questionList.length+1;
    this.blobQuestionObject.push(blobQuestionMap);
   // this.questionObj.blobQuestion = file;
   // this.questionObj.blobObjectUrl = this.blobQuestionUrl;
    
  }
}
  
  console.log(this.quizObj ,this.questionObj  ,file);
 
}
getBlob(editQuestion:Question){

console.log(editQuestion.questionSeq);


}

video() {
  console.log('im Play!');
  this.videoplayer.Play();
}
pauseVideo(videoplayer)
{
  videoplayer.nativeElement.play();
  // this.startedPlay = true;
  // if(this.startedPlay == true)
  // {
     setTimeout(() => 
     {
      videoplayer.nativeElement.pause();
       if(videoplayer.nativeElement.paused)
      {
        this.show = !this.show;       
      } 
     }, 5000);
  // }
}

closebutton(videoplayer){
  this.show = !this.show; 
  videoplayer.nativeElement.play();
}
onAudioPlay(){
  this.audioPlayerRef.nativeElement.play();
}

saveColorSetting(){

  console.log(this.blobAnswerSet);
  console.log(this.blobQuestionObject);
  this.quizObj.quizSetting = this.quizSetting;
  this.quizObj.grade = this.gradeObj;
  this.quizObj.quizIndex = this.quizObj.quizIndex!=null?this.quizObj.quizIndex:this.quizList.length +1;
  this.quizObj.creator = Number(localStorage.getItem("userId"));
  this.quizObj.status ='Review';
  console.log(this.quizObj);
  console.log(this.blobQuestionObject.length)
  console.log(JSON.stringify(this.quizObj));
  this.quizService.saveQuizWithQuestion(this.quizObj).subscribe(
    res => {
     // console.log(res.json());
     this.quizObj = res.json();
     console.log(res.json());
      this.saveBlobQuestionAnswer(this.quizObj);
    
      this.clickTab('publish');
    },
    err => {
      console.log(err);
    }
  );
  

  
 }

  saveBlobQuestionAnswer(quizBlob: Quiz){
  
  console.log( quizBlob);
 
console.log( this.blobQuestionObject);
let i =0;
quizBlob.questionList.forEach(question => {
  console.log(question,question.questionSeq);
  

    this.quizService.addBlobQuestion(quizBlob.quizIndex,question,this.blobQuestionObject).subscribe(
      res => {
       // console.log(res.json());
      console.log(res);
      },
      err => {
        console.log(err);
      }
    );


  
  i++;
});

}
  
reviewAction(status){
console.log(this.comment);
this.quizObj.comment=this.comment;
  switch (status) {
    case "Approve":
     // alert();
      this.quizObj.status ='Published';
      break;
    case "ToDo":
    this.quizObj.status ='Review';
    break;
    case "Reject":
      this.quizObj.status ='Rejected';
      break;
    default:
      this.quizObj.status ='In_Design';
      break;
  }

  console.log(this.quizObj);
  this.clickTab('publish');
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
