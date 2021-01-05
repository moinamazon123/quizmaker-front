import { OnInit, Component } from '@angular/core';
import { Question } from 'src/app/models/Question';
import { QuizService } from 'src/app/services/quiz.service';
import { Quiz } from 'src/app/models/Quiz';
import { Answers } from 'src/app/models/Answers';
import { QuizConfig } from 'src/app/models/quiz-config';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizUser } from 'src/app/models/QuizUser';
import { QuizSetting } from 'src/app/models/QuizSetting';
import { stringify } from 'querystring';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { SurveyUser } from 'src/app/models/SurveyUser';
import { SurveyQuestion } from 'src/app/models/SurveyQuestion';
declare let $: any;
import * as CanvasJS from './canvasjs.min.js';

@Component({
    selector: 'survey-play',
    templateUrl: './survey-play.component.html',
    styleUrls: ['./survey-play.component.css']
  })
export class SurveyPlayComponent implements OnInit {
    quizes: any[];
    quiz: Quiz =new Quiz();
    quizUser : QuizUser = new QuizUser();
    surveyUser:SurveyUser = new SurveyUser();
    surveyQuestionList:SurveyQuestion[]=[];
    quizSettings : QuizSetting = new QuizSetting();
    introductionFlag:boolean = true;
    introductionMessage : string;
    conclusionMessage : string;
    termAcceptance:boolean=false;
    mode = 'quiz';
    quizName: string;
    feedBackFlag : boolean = false;
    notAnsweredFlag : boolean = false;
    quizIntroFlag : boolean = false;
    happySubmit : boolean = false;
    showAns:boolean = false;
    showScore:boolean = false;
    maxAttemptLeft : number =0;
    ans : Answers = new Answers();
    result:string=null;
     multiAnsMap = new Object();
     multiAnsMapList =[];
     userId:number;
     message: string;
     quizStatus : string;
     dataPoint1:any={};
     dataPoint2:any={};
     dataPoints: any=[];
     surveyGiven : number;
     surveyNotGiven:number;
     correctAns:string;
    correctAnsList:any[]=[];
    quizParticipationFlg:boolean=false;
    config: QuizConfig = {
      'allowBack': true,
      'allowReview': true,
      'autoMove': false,  // if true, it will move to next question automatically when answered.
      'duration': 300,  // indicates the time (in secs) in which quiz needs to be completed. 0 means unlimited.
      'pageSize': 1,
      'requiredAll': false,  // indicates if you must answer all the questions before submitting.
      'richText': false,
      'shuffleQuestions': false,
      'shuffleOptions': false,
      'showClock': false,
      'showPager': true,
      'theme': 'none'
    };
   
    pager = {
      index: 0,
      size: 1,
      count: 1
    };
    timer: any = null;
    startTime: Date;
    endTime: Date;
    start;
    end;
    time;
    score:number=0;
    percentage:string =null;
    totCorrect:number =0;
    passMark : number =0;
    ellapsedTime = '00:00';
    duration = '00:01';
    questionShow:Question;
    surveyIndex:number;
    grade : string = null;
    radioValue :boolean;
     selectedOptions=[];
     previewMode:boolean;
     submitFlag=false;
     public form: FormGroup;
  
    constructor(private fb: FormBuilder,private _Activatedroute:ActivatedRoute,private quizService: QuizService,private router : Router) {

      this._Activatedroute.paramMap.subscribe(params => { 
        this.surveyIndex = Number(params.get('surveyIndex')); 

      });

      this.quizService.getSurveyByIndex(this.surveyIndex).subscribe(res => {
        console.log(res.json());
        this.introductionMessage = res.json().introduction_message;
        this.quizSettings = res.json().quizSetting;
      });

      this.form = this.fb.group({
        rating1: ['', Validators.required],
      });

     }
  
    ngOnInit() {
      console.log(this.surveyIndex, this.router.url );
     
      if(this.router.url.includes('survey-preview')){
        this.previewMode = true;
     } else {
       this.previewMode = false;
      this.userId = this.getWithExpiry("userId");
      

      if(this.userId == null){
        console.log("Session is Expired");
        localStorage.setItem("lastURL","/survey-play/"+this.surveyIndex);
        this.router.navigate(['/login']).then(s =>location.reload());;
    
       }
       
       this.checkParicipation( this.userId,this.surveyIndex)
      }
    
      //this.loadQuiz(this.quizIndex);
    }
  checkParicipation(userId: number, surveyIndex: number) {
    
      this.quizService.getSurveyParticipation(userId,surveyIndex).subscribe(res=>{
          this.quizParticipationFlg = res.json();

      },
      error=>{

      });

  }
  
  

    startQuiz(event){
      if(event.target.checked){
        this.loadQuiz(this.surveyIndex);
      } else {
        this.message="Kindly Accept Terms!";
      }

    }

     loadQuiz(quizIndex: number) {
 
      this.start = new Date().getTime();
      this.totCorrect =0;
      this.introductionFlag = false;
     
         let quiz: Quiz;
         this.quizService.getSurveyByIndex(quizIndex).subscribe(res => {
           console.log(res.json());
           quiz = res.json();
          // this.quiz = res;//new Quiz(res);
           this.pager.count = quiz.questionList.length;
           this.startTime = new Date();
           this.ellapsedTime = '00:00';
          // this.timer = setInterval(() => { this.tick(); }, 1000);
          // this.duration = this.parseTime(quiz.time);
           //this.questionShow = this.quiz.questionList[0];
           this.quiz = quiz;
           this.showAns = quiz.show_answer;
           this.showScore = quiz.show_score;
           this.passMark = quiz.passMark;
           this.quizStatus = quiz.status; 
           this.questionShow = this.quiz.questionList[0];
           this.mode = 'quiz';
         });
        
       } 
  
    showPage(pageNo:number){
      console.log(pageNo);
      this.pager.index  =pageNo;
      this.selectedOptions =[];
      if(pageNo === this.quiz.questionList.length){
        this.submitFlag = true;
        this.pager.index  =this.quiz.questionList.length-1;
        console.log(this.quiz);
        if(this.router.url.includes('survey-preview')){
           this.previewMode = true;
        } else {
          this.previewMode = false;
        
/** Saving Survey Response 

this.quizService.saveSurveyWithOption(this.quiz).subscribe(
  res => {
    console.log(res.json());
   this.quiz = res.json();
   console.log(res.json());
       
  },
  err => {
    console.log(err);
  }
);**/

       this.quiz.questionList.forEach(question=>{

        let surveyQuestion:SurveyQuestion=new SurveyQuestion();
        surveyQuestion.survey_question = question.question_title;
        question.responseList.forEach(response=>{
          surveyQuestion.question_type = response.surveyTextOption?"Text":"Rating";
          surveyQuestion.response = response.surveyText;
          surveyQuestion.rating = response.rating;
        })
        this.surveyQuestionList.push(surveyQuestion);
       })
        this.end = new Date().getTime() ;
        this.time = this.end - this.start ;
        this.happySubmit = true;
     //   this.calculateScore(this.quiz.questionList);
     console.log(this.passMark);
     if(this.score>=this.passMark){
       this.result ='PASS';
     }else{
      this.result ='FAIL';
     }
     this.percentage = (this.totCorrect * 100 / this.quiz.questionList.length).toFixed();
     console.log( this.percentage);

    this.surveyUser.survey_id = this.quiz.surveyIndex;

    this.surveyUser.userId = this.userId;
    this.surveyUser.surveyParticipated = true;
    this.surveyUser.surveyQuestionSet =  this.surveyQuestionList;
    this.surveyUser.completion_time = (this.time / 1000).toString();

   console.log( this.surveyUser);


   this.quizService.submitSurvey(this.surveyUser).subscribe( res =>{

    this.message = res["_body"];
    this.createSurveyData();
},
error => {
 console.log(error.json());
}
);

    console.log('Execution time: ' + this.time / 1000 +" Score :"+this.score);
  this.mode = 'result';
 
 
}
      } else {
        console.log(this.quiz.questionList.length);
        this.questionShow = this.quiz.questionList[pageNo];
      }
  
    }

    createSurveyData(){
      let total:number;let surveyGiven:number; let dataPoints:any[]=[];let surveyNotGiven:Number;
      this.quizService.getTotalSurveyUser(this.surveyIndex).subscribe(res=>{
        total = res.json().length;
        console.log(total)
        console.log(surveyGiven,total)
        surveyNotGiven = Number(total)-Number(surveyGiven) ;
        this.dataPoint1.y=surveyGiven;
		 this.dataPoint1.label='Participated';
		 dataPoints.push(this.dataPoint1);
		 this.dataPoint2.y=surveyNotGiven;
		 this.dataPoint2.label='Not Participated';
		 dataPoints.push(this.dataPoint2);
     this.dataPoints = dataPoints;
     console.log(this.dataPoints);
      this.renderMultiBar(this.dataPoints);
      },
      error => {
        console.log(error.json());
       }
      );

      this.quizService.getSurveyParticipated(this.surveyIndex).subscribe(res=>{
        surveyGiven = res.json();
        
      },
      error => {
        console.log(error.json());
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


    calculateGrade(percentage){
        let grade=null;
        if(Number(percentage) >= this.quiz.grade.gradeAPlus){
          alert();
          grade = "A+";
        }
        else if(Number(percentage) >= this.quiz.grade.gradeA && Number(percentage) < this.quiz.grade.gradeAPlus){
          grade = "A";
        }
        else if(Number(percentage) >= this.quiz.grade.gradeAMinus && Number(percentage) < this.quiz.grade.gradeA){
          grade = "A-";
        }
        else if(Number(percentage) >= this.quiz.grade.gradeBPlus && Number(percentage) < this.quiz.grade.gradeAMinus ){
          grade = "B+";
        }
        else if(Number(percentage) >= this.quiz.grade.gradeB &&  Number(percentage) < this.quiz.grade.gradeBPlus){
          grade = "B";
        }
        else if(Number(percentage) >= this.quiz.grade.gradeBMinus &&  Number(percentage) < this.quiz.grade.gradeB){
          grade = "B-";
        } else if(Number(percentage) >= this.quiz.grade.gradeCPlus && Number(percentage) < this.quiz.grade.gradeBMinus ){
          grade = "C+";
        }
        else if(Number(percentage) >= this.quiz.grade.gradeC &&  Number(percentage) < this.quiz.grade.gradeCPlus){
          grade = "C";
        }
        else if(Number(percentage) >= this.quiz.grade.gradeCMinus &&  Number(percentage) < this.quiz.grade.gradeC){
          grade = "C-";
        }else{
          grade ="D";
        }

       return grade;

    }

  
    tick() {
    
      const now = new Date();
      const diff = (now.getTime() - this.startTime.getTime()) / 1000;
      
      
      this.ellapsedTime = this.parseTime(diff);
       
     
    }
  
    parseTime(totalSeconds: number) {
      let mins: string | number = Math.floor(totalSeconds / 60);
      let secs: string | number = Math.round(totalSeconds % 60);
      mins = (mins < 10 ? '0' : '') + mins;
      secs = (secs < 10 ? '0' : '') + secs;
      return `${mins}:${secs}`;
    }
  
    get filteredQuestions() {
      return (this.quiz.questionList) ?
        this.quiz.questionList.slice(this.pager.index, this.pager.index + this.pager.size) : [];
    }
  
    onSelect(question: Question, option: Answers) {
      console.log(question);
       


    }
    onShortSelect(question:Question){
      console.log(question,this.correctAns);
        let correctFlag:string;
      question.responseList.forEach(response=>{

        if(response.correctAnswerFlag){
          if(response.response === this.correctAns.trim()){
          correctFlag ='correct';
          this.score=this.score!=0?this.score:0;
          this.totCorrect=this.totCorrect+1;
          console.log(question.question_mark);
          this.score=this.score+question.question_mark;
          this.correctAnsList.push(this.correctAns.trim()+"_"+question.questionSeq);
          console.log(this.score);
          } else {
            correctFlag ='wrong';
            this.correctAnsList.push(this.correctAns.trim()+"_"+question.questionSeq);
          }

        } else {
          correctFlag ='wrong';
          //this.correctAnsList.push(this.correctAns.trim());
        }

      });
      console.log(correctFlag);
      return correctFlag;
    }
  
   


    onMultiSelet(e,question: Question, option: Answers){
      //alert($(":checkbox").length);
       let multiAnsMap=new Object();
     console.log(e.target.checked);
     if(e.target.checked) {
      this.selectedOptions.push(option.response);
      multiAnsMap["questionSeq"] = question.questionSeq;
      multiAnsMap["options"] =  this.selectedOptions.filter((n, i) => this.selectedOptions.indexOf(n) === i);;
      this.multiAnsMapList.push( multiAnsMap);
     } else {
        let index =  this.selectedOptions.indexOf(option.response);
        this.selectedOptions.splice(index,1);
        multiAnsMap["questionSeq"] = question.questionSeq;
        multiAnsMap["options"] =  this.selectedOptions.filter((n, i) => this.selectedOptions.indexOf(n) === i);;
        this.multiAnsMapList.push( multiAnsMap);
       
     }
 
      const distinctSelectOption = this.selectedOptions.filter((n, i) => this.selectedOptions.indexOf(n) === i);
      
      console.log( distinctSelectOption);
      this.multiAnsMapList = this.multiAnsMapList.filter((n, i) => this.multiAnsMapList.indexOf(n) === i);
      console.log(this.multiAnsMapList);
           
      console.log(question);
      console.log(this.isMultiCorrect(question,distinctSelectOption));

     // if(JSON.stringify(distinctSelectOption.sort()) === JSON.stringify(this.isMultiCorrect(question).sort())){
      if(this.isMultiCorrect(question,distinctSelectOption) === 'correct'){
        console.log("Correct");
        this.score=this.score!=0?this.score:0;
        this.totCorrect=this.totCorrect+1;
        console.log(question.question_mark);
        this.score=this.score+question.question_mark;
        console.log(this.score)
       
       
        console.log( this.quiz.questionList);
        return 'correct';

      }else{
        console.log("Wrong");
        return 'Wrong';
      }

   
      //this.marked= e.target.checked;
    }

    isMultiAnsCheck(question:Question){
      console.log(question);
        let ans = null;
      this.multiAnsMapList.forEach(element =>{
        if(element.questionSeq === question.questionSeq){
            if(this.isMultiCorrect(question,element.options) === 'correct'){
            ans = 'correct';
            } else{
              ans = 'wrong';
            }

        }

      })
      return ans;
    }

   enteredAnwer(question:Question){
      let entAns:string; let ans = null;
  this.correctAnsList.forEach(elem =>{
    console.log(Number(elem.split("_")[1])===question.questionSeq);
    if(Number(elem.split("_")[1])===question.questionSeq){
      entAns = elem.split("_")[0];
    
    }

  });
  console.log(entAns);
  return entAns;
  
}
  

    isShortAnsCheck(question:Question){
          let entAns:string; let ans = null;
      this.correctAnsList.forEach(elem =>{
        console.log(Number(elem.split("_")[1])===question.questionSeq);
        if(Number(elem.split("_")[1])===question.questionSeq){
          entAns = elem.split("_")[0];
        
        }

      });
      console.log(entAns);
      question.responseList.forEach(response=>{

        if(response.correctAnswerFlag){
          if(response.response === entAns){
            ans = 'correct'
          } else {
            ans ='wrong';
            
          }

        } else {
          ans ='wrong';
          //this.correctAnsList.push(this.correctAns.trim());
        }

      });
      console.log(ans);
      return ans;
    }

    goTo(index: number) {
      if (index >= 0 && index < this.pager.count) {
        this.pager.index = index;
        this.notAnsweredFlag = false;
        this.questionShow = this.quiz.questionList[index];
        this.mode = 'quiz';
      }
    }
  
    isAnswered(question: Question) {
      return question.responseList.find(x => x.selected) ? 'Answered' : 'Not Answered';
    };
  
    isCorrect(question: Question) {
       // console.log(question.responseList.every(x => x.selected === x.correctAnswerFlag) ? 'correct' : 'wrong');
      return question.responseList.every(x => x.selected === x.correctAnswerFlag) ? 'correct' : 'wrong';
    };
    isMultiCorrect(question: Question,distinctSelectOption) {
     // console.log(distinctSelectOption);
      let correctOpt =[];
      question.responseList.forEach(response =>{
          if(response.correctAnswerFlag){
            correctOpt.push(response.response);
          }

      });
      return JSON.stringify(distinctSelectOption.sort()) === JSON.stringify(correctOpt.sort())? 'correct' : 'wrong';

  
    
  }

    correctAnswer(question: Question) {
          let answers =['Correct answer is/are '];
      question.responseList.forEach(element =>{
          if(element.correctAnswerFlag){
            answers.push(element.response);
          }
  
      });
      return answers;
    }
    
    onSubmit() {
      this.end = new Date().getTime();
      this.time = this.end - this.start / 1000;
  console.log('Execution time: ' + this.time);
      let answers = [];
      this.happySubmit = true;
      this.quiz.questionList.forEach(x => 
             answers.push({ 'quizId': this.quiz.id, 'questionId': x.id, 'answered': x.answered })
        );
       
        this.quiz.questionList.forEach(Qelement => {
          Qelement.responseList.forEach(Aelement => {
              if(!Aelement.selected){
                this.mode = 'review';
                this.notAnsweredFlag = true;
              } else {
                this.notAnsweredFlag = false;
                console.log(  this.notAnsweredFlag );
               
                this.mode = 'result';
              }
          });
         
        });
      // Post your data to the server here. answers contains the questionId and the users' answer.
      console.log(this.quiz.questionList);
      //this.mode = 'result';
    }
    forceSubmit(){
      let answers = [];
      
      this.quiz.questionList.forEach(x => 
             answers.push({ 'quizId': this.quiz.id, 'questionId': x.id, 'answered': x.answered })
        );
        console.log(this.quiz.questionList);
        this.mode = 'result';
  
    }
  
    renderMultiBar(dataPoints){

      let chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        exportEnabled: true,
        title: {
          text: "Statistics"
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
          dataPoints: dataPoints
        }]
      });
    
      chart.render();
    
    
    }
    
    feedback(){
      this.feedBackFlag = true;
      console.log(this.quizUser);
    }
   
  }
  