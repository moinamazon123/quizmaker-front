import { OnInit, Component, Output, EventEmitter } from '@angular/core';
import { Question } from 'src/app/models/Question';
import { QuizService } from 'src/app/services/quiz.service';
import { Quiz } from 'src/app/models/Quiz';
import { Answers } from 'src/app/models/Answers';
import { QuizConfig } from 'src/app/models/quiz-config';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizUser } from 'src/app/models/QuizUser';
import { QuizSetting } from 'src/app/models/QuizSetting';
import { stringify } from 'querystring';
import { UserQuestionMap } from 'src/app/models/UserQuestionMap';
declare let $: any;

@Component({
    selector: 'quiz-play',
    templateUrl: './quiz-play.component.html',
    styleUrls: ['./quiz-play.component.css']
  })
export class QuizPlayComponent implements OnInit {
    quizes: any[];
    quiz: Quiz =new Quiz();
    quizUser : QuizUser = new QuizUser();
    quizSettings : QuizSetting = new QuizSetting();
    introductionFlag:boolean = true;
    introductionMessage : string;
    conclusionMessage : string;
    termAcceptance:boolean=false;
    mode = 'quiz';
    quizName: string;
    feedBackFlag : boolean = false;
    timeOff = false;
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
     previewMode:boolean;
     correctAns:string;
    correctAnsList:any[]=[];
    alreadyAttendedQuizFlag:boolean=false;
    userQuestionMapList : UserQuestionMap[]=[];
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
    randomQuestions:Question[]=[];
    quizIndex:number;
    grade : string = null;
    radioValue :boolean;
    partialQuestionsFromAlreadyGiven :Question[]=[];
    recurringExamFlag = false;
     selectedOptions=[];
     myProperty = true;
     
  
    constructor(private _Activatedroute:ActivatedRoute,private quizService: QuizService,private router : Router) {

      this._Activatedroute.paramMap.subscribe(params => { 
        this.quizIndex = Number(params.get('quizIndex')); 

      });

      this.quizService.getQuizByIndex(this.quizIndex).subscribe(res => {
        console.log(res.json());
        this.introductionMessage = res.json().introduction_message;
        this.quizSettings = res.json().quizSetting;
      });

     }
  
    ngOnInit() {

     

      if(this.router.url.includes('quiz-preview')){
        this.previewMode = true;
     } else {
       this.previewMode = false;


      console.log(this.quizIndex );
      this.quizes = this.quizService.getAll();
      console.log(this.quizes);
      this.userId = this.getWithExpiry("userId");

      if(this.userId == null){
        console.log("Session is Expired");
        localStorage.setItem("lastURL","/quiz-play/"+this.quizIndex);
        this.router.navigate(['/login']).then(s =>location.reload());;
    
       }

      this.quizService.getQuizMaxAttempt(this.userId,this.quizIndex).subscribe(res=>{
          this.maxAttemptLeft = res["_body"];
          if(res["_body"] ==='') {
          this.maxAttemptLeft =0;
          console.log(this.maxAttemptLeft);
          }else {
            this.maxAttemptLeft = res.json().max_attempt_left;
            if( this.maxAttemptLeft ===0){
              this.introductionFlag = true;
              this.message = " You dont have any attempt left!";
            }
            console.log(this.maxAttemptLeft);
          }
      }
      ,
      err => {
        console.log(err);
      }
    );
     }
      this.quizName = this.quizes[0].name;
      this.checkAlreadyGivenQuiz( this.userId,this.quizIndex );
      //this.loadQuiz(this.quizIndex);
    }


  checkAlreadyGivenQuiz(userId: number, quizIndex: number) {
   
    this.quizService.checkAlreadyGivenQuiz(userId,quizIndex).subscribe(res=>{

      this.userQuestionMapList = res.json();
      console.log(this.userQuestionMapList);
      if( this.userQuestionMapList.length>0){
        this.alreadyAttendedQuizFlag = true;
      } 


    },
    err => {
      console.log(err);
    }
  );


  }
  
   

    startQuiz(event){
      if(event.target.checked){
        this.loadQuiz(this.quizIndex);
      } else {
        this.message="Kindly Accept Terms!";
      }

    

    }

     loadQuiz(quizIndex: number) {
 
      this.start = new Date().getTime();
      this.totCorrect =0;
      this.introductionFlag = false;
     
         let quiz: Quiz;
         this.quizService.getQuizByIndex(quizIndex).subscribe(res => {
           console.log(res.json());
           quiz = res.json();
          // this.quiz = res;//new Quiz(res);
          if(!this.alreadyAttendedQuizFlag){
          this.loadRandomQuestions(quiz); // For user who got FAIL for the first time
          }else{
            this.loadRandomQuestionRecurring(quiz); // For user who has result FAIL and want to appear another time
          }
           this.pager.count = this.randomQuestions.length;//quiz.questionList.length;
           this.startTime = new Date();
           this.ellapsedTime = '00:00';
           this.timer = setInterval(() => { this.tick(); }, 1000);
           this.duration = this.parseTime(quiz.time);
           //this.questionShow = this.quiz.questionList[0];
           
           this.quiz = quiz;
           this.showAns = quiz.show_answer;
           this.showScore = quiz.show_score;
           this.passMark = quiz.passMark;
           this.quizStatus = quiz.status; 
           this.questionShow = this.randomQuestions[0];//this.quiz.questionList[0];
           this.mode = 'quiz';
         });
        
       } 

  loadRandomQuestionRecurring(quiz: Quiz) {
    console.log(this.userQuestionMapList);
    let randomArray:Question[]=[]; let questionId=[];
    let randomArray1:Question[]=[]; 
    this.recurringExamFlag=true;
    let alreadyGivenQuestions = ((this.userQuestionMapList.length * 20) / 100).toFixed(); // 20 % of already Given Questions.
   
    for(let i=0;i<=Number(alreadyGivenQuestions);i++){

      questionId.push(this.userQuestionMapList[i].question_id);
    }
    quiz.questionList.forEach(elem=>{
          if(questionId.includes(elem.id)){
            randomArray.push(elem);
          }

    })
    this.partialQuestionsFromAlreadyGiven = randomArray;
console.log(randomArray);
    quiz.questionList.forEach(elem=>{
      if(!questionId.includes(elem.id)){
        randomArray1.push(elem);
      }

})
console.log(randomArray1);
 let randomQuestions = quiz.randomQuestions-randomArray.length; 
 this.randomQuestions=[];
 console.log(randomQuestions)

 quiz.randomQuestions = randomQuestions;
 quiz.questionList = randomArray1;
 this.loadRandomQuestions(quiz);

/** Select random 20 % of questions from given questions **/
    /** do {
      console.log(randomQuestions,Math.floor(Math.random()*randomArray1.length));
      this.randomQuestions.push(randomArray1[Math.floor(Math.random()*randomArray1.length)])
         
      this.randomQuestions =randomArray1.filter((question, i, arr) => {
       return arr.indexOf(arr.find(t => t.id === question.id)) === i;
     });// this.randomQuestions.filter((n, i) => this.randomQuestions.indexOf(n) === i);
      randomQuestions--;
      console.log( this.randomQuestions);
   } while (  this.randomQuestions.length != 2);
      
   //this.randomQuestions =  this.randomQuestions.concat(randomArray); **/
       console.log( quiz.randomQuestions);
     }

  

  loadRandomQuestions(quiz:Quiz) {
    let randomArray=[];
    let randomQuestions = quiz.randomQuestions;
do {
   console.log(randomQuestions,Math.floor(Math.random()*quiz.questionList.length));
   this.randomQuestions.push(quiz.questionList[Math.floor(Math.random()*quiz.questionList.length)])
      
   this.randomQuestions =this.randomQuestions.filter((question, i, arr) => {
    return arr.indexOf(arr.find(t => t.id === question.id)) === i;
  });// this.randomQuestions.filter((n, i) => this.randomQuestions.indexOf(n) === i);
   randomQuestions--;
   console.log( this.randomQuestions);
} while (  this.randomQuestions.length != quiz.randomQuestions);
   if(this.recurringExamFlag){
    this.randomQuestions = this.randomQuestions.concat(this.partialQuestionsFromAlreadyGiven);
   }
    console.log( this.randomQuestions);
  }
  
    showPage(pageNo:number){
      this.pager.index  =pageNo;
      this.selectedOptions =[];
     // if(pageNo === this.quiz.questionList.length){
        if(pageNo === this.randomQuestions.length){
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
    // this.percentage = (this.totCorrect * 100 / this.quiz.questionList.length).toFixed();
     this.percentage = (this.totCorrect * 100 / this.randomQuestions.length).toFixed();
     console.log( this.percentage);
    this.grade = this.calculateGrade(this.percentage);
    this.quizUser.grade= this.grade;
    this.quizUser.max_attempt_left = this.maxAttemptLeft===0 ? this.quiz.max_attempt-1:this.maxAttemptLeft-1;
    this.quizUser.percentage =  this.percentage ;
    this.quizUser.quiz_id = this.quiz.quizIndex;
    this.quizUser.result = this.result;
    this.quizUser.score = this.score;
    this.quizUser.quiz_category_id = this.quiz.category.category_id;
    this.quizUser.userId = this.userId;
    this.quizUser.completion_time = (this.time / 1000).toString() ;//this.duration;
    this.quizUser.completion_date = new Date().toString();
    this.quizUser.max_attempt = this.quiz.max_attempt;
    this.quizUser.questionList =  this.randomQuestions;
    this.timer = setInterval(() => { this.tick(); }, 1000);

   
    console.log('Execution time: ' + this.time / 1000 +" Score :"+this.score);
  this.mode = 'result';

 
      } else {
        console.log(this.randomQuestions.length);
        //this.questionShow = this.quiz.questionList[pageNo];
        this.questionShow = this.randomQuestions[pageNo];
      }
  
    }

    autoSubmitQuiz(pageNo:number){
      this.pager.index  =pageNo;
      this.selectedOptions =[];
      if(pageNo === this.randomQuestions.length){
        this.end = new Date().getTime() ;
        this.time = this.end - this.start ;
        this.happySubmit = false;
     //   this.calculateScore(this.quiz.questionList);
     console.log(this.passMark);
     if(this.score>=this.passMark){
       this.result ='PASS';
     }else{
      this.result ='FAIL';
     }
     this.percentage = (this.totCorrect * 100 / this.randomQuestions.length).toFixed();
     console.log( this.percentage);
    this.grade = this.calculateGrade(this.percentage);
    this.quizUser.grade= this.grade;
    this.quizUser.max_attempt_left = this.maxAttemptLeft===0 ? this.quiz.max_attempt-1:this.maxAttemptLeft-1;
    this.quizUser.percentage =  this.percentage ;
    this.quizUser.quiz_id = this.quiz.quizIndex;
    this.quizUser.result = this.result;
    this.quizUser.score = this.score;
    this.quizUser.quiz_category_id = this.quiz.category.category_id;
    this.quizUser.userId = this.userId
    this.quizUser.completion_time = this.duration;
    this.quizUser.completion_date = new Date().toString();
    this.quizUser.max_attempt = this.quiz.max_attempt;
    this.quizUser.questionList =  this.randomQuestions;
   
   // console.log('Execution time: ' + this.time / 1000 +" Score :"+this.score);
  this.mode = 'result';
      } else {
        console.log(this.randomQuestions.length);
        this.questionShow = this.randomQuestions[pageNo];
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
            localStorage.setItem("msg","Session is Expired");
            console.log("Session Expired");
        return null
      }
      return item.value;
    }


    calculateGrade(percentage){
        let grade=null;
        if(Number(percentage) >= this.quiz.grade.gradeAPlus){
         
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
    if(!this.happySubmit){
      const now = new Date();
      const diff = (now.getTime() - this.startTime.getTime()) / 1000;
      
      
      this.ellapsedTime = this.parseTime(diff);
     
      if(this.ellapsedTime == this.duration){
        this.timeOff = true;
       // this.autoSubmitQuiz(this.quiz.questionList.length);
       this.autoSubmitQuiz(this.randomQuestions.length);
      }
      }
       
     
    }
  
    parseTime(totalSeconds: number) {
      let mins: string | number = Math.floor(totalSeconds / 60);
      let secs: string | number = Math.round(totalSeconds % 60);
      mins = (mins < 10 ? '0' : '') + mins;
      secs = (secs < 10 ? '0' : '') + secs;
      return `${mins}:${secs}`;
    }
  
    get filteredQuestions() {
      /** return (this.quiz.questionList) ?
        this.quiz.questionList.slice(this.pager.index, this.pager.index + this.pager.size) : []; **/
        return (this.randomQuestions) ?
        this.randomQuestions.slice(this.pager.index, this.pager.index + this.pager.size) : [];
    }
  
    onSelect(question: Question, option: Answers) {
      
        question.responseList.forEach((x) => { if (x.id !== option.id) x.selected = false; });
    
      if(this.isCorrect(question) ==='correct'){
        this.score=this.score!=0?this.score:0;
        this.totCorrect=this.totCorrect+1;
        console.log(question.question_mark);
        this.score=this.score+question.question_mark;
        console.log(this.score)
      }
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
        this.questionShow = this.randomQuestions[index];//this.quiz.questionList[index];
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
     /**  this.quiz.questionList.forEach(x => 
             answers.push({ 'quizId': this.quiz.id, 'questionId': x.id, 'answered': x.answered })
        ); **/

        this.randomQuestions.forEach(x => 
          answers.push({ 'quizId': this.quiz.id, 'questionId': x.id, 'answered': x.answered })
     );
       
       // this.quiz.questionList.forEach(Qelement => {
        this.randomQuestions.forEach(Qelement => {
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
      console.log(this.randomQuestions);
      //this.mode = 'result';
    }
    forceSubmit(){
      let answers = [];
      
      /** this.quiz.questionList.forEach(x => 
             answers.push({ 'quizId': this.quiz.id, 'questionId': x.id, 'answered': x.answered })
        ); **/
        this.randomQuestions.forEach(x => 
          answers.push({ 'quizId': this.quiz.id, 'questionId': x.id, 'answered': x.answered })
     );
        console.log(this.randomQuestions);
        this.mode = 'result';
  
    }
  
  
    feedback(){
      this.feedBackFlag = true;
      console.log(this.quizUser);
    }
   
  }
  