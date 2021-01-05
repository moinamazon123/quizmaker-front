import { Category } from './../models/Category';
import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import {AppConst} from '../constants/app-const';
import { Quiz } from '../models/Quiz';
import { Activity } from '../models/Activity';

import {

  HttpRequest, HttpClient,

} from "@angular/common/http";
import { BlobQuestionMap } from '../models/BlobQuestionMap';
import { Question } from '../models/Question';
import { QuizUser } from '../models/QuizUser';
import { Answers } from '../models/Answers';
import { BlobAnswer } from '../models/BlobAnswer';
import { SurveyUser } from '../models/SurveyUser';

@Injectable()
export class QuizService {

  constructor(private http:Http , private httpClient:HttpClient) { }

  getActivityList() {
  	let url = AppConst.serverPath+"/quizmaker/activities";

  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem("xAuthToken")
  	});
  	return this.http.get(url, {headers: tokenHeader});
  }

  getEligibility(userId){

    let url = AppConst.serverPath+"/quizmaker/getQuizEligibility/"+userId;

  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem("xAuthToken")
  	});
  	return this.http.get(url, {headers: tokenHeader});


  }

  checkAlreadyGivenQuiz(userId,quizId){


    let url = AppConst.serverPath+"/quizmaker/getUserQuestionMap/"+userId+"/"+quizId;
    let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem("xAuthToken")
  	});

    return this.http.get(url, {headers: tokenHeader});
  }

  getSurveyParticipated(surveyId){

    let url = AppConst.serverPath+"/quizmaker/getSurveyParticipatedCount/"+surveyId;
    let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem("xAuthToken")
  	});
  	return this.http.get(url, {headers: tokenHeader});

  }

  getTotalSurveyUser(surveyId){
    let url = AppConst.serverPath+"/quizmaker/getSurveyAssignee/"+surveyId;
    let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem("xAuthToken")
  	});
  	return this.http.get(url, {headers: tokenHeader});

  }


  submitSurvey(surveyUser:SurveyUser){

    console.log(JSON.stringify(surveyUser));

    let url = AppConst.serverPath+"/quizmaker/postSurvey";
    let tokenHeader = new Headers({
      'Content-Type' : 'application/json',
      'x-auth-token' : localStorage.getItem("xAuthToken")
    });
    return this.http.post(url, JSON.stringify(surveyUser), {headers: tokenHeader});
  }
 
  submitQuiz(quizUser:QuizUser){
  
    console.log(quizUser);
    for (let [key, value] of Object.entries(quizUser)) {
      console.log(key + ':' + value);
    }
    
    console.log(JSON.stringify(quizUser));

    let url = AppConst.serverPath+"/quizmaker/submitQuiz";
    let tokenHeader = new Headers({
      'Content-Type' : 'application/json',
      'x-auth-token' : localStorage.getItem("xAuthToken")
    });
    return this.http.post(url, JSON.stringify(quizUser), {headers: tokenHeader});
  }

  uploadBlobQuestion(blobQuestion: File,quizId:number,type:string) {
    const uploadUrl = "http://localhost:8181/quizmaker/add/image/"+quizId+"/"+"question_"+type;

  console.log(blobQuestion);
    let formData = new FormData();
    formData.append("picture", blobQuestion);
    return this.httpClient.post(uploadUrl,formData);
 
  }

checkSession(){

  let url = AppConst.serverPath+"/checkSession";


  return this.http.get(url);

}

  getQuizList() {
  	let url = AppConst.serverPath+"/quizmaker/quizList";

  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem("xAuthToken")
  	});
  	return this.http.get(url, {headers: tokenHeader});
  }

  getSurveyList() {
  	let url = AppConst.serverPath+"/quizmaker/surveyList";

  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem("xAuthToken")
  	});
  	return this.http.get(url, {headers: tokenHeader});
  }

  getQuestionBankCount() {
  	let url = AppConst.serverPath+"/quizmaker/getQuestionBankCount";

  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem("xAuthToken")
  	});
  	return this.http.get(url, {headers: tokenHeader});
  }

  saveQuiz(quiz : Quiz){
    console.log(quiz);
        let url = AppConst.serverPath+"/quizmaker/addQuizIntro";
        let tokenHeader = new Headers({
          'Content-Type' : 'application/json',
          'x-auth-token' : localStorage.getItem("xAuthToken")
        });
        return this.http.post(url, quiz, {headers: tokenHeader});
      }


      saveQuizWithQuestion(quiz : Quiz){
        console.log(quiz);
            let url = AppConst.serverPath+"/quizmaker/addQuiz";
            let tokenHeader = new Headers({
              'Content-Type' : 'application/json',
              'x-auth-token' : localStorage.getItem("xAuthToken")
            });
            return this.http.post(url, quiz, {headers: tokenHeader});
          }


      saveSurveyWithOption(quiz : Quiz){
        console.log(quiz);
            let url = AppConst.serverPath+"/quizmaker/addSurvey";
            let tokenHeader = new Headers({
              'Content-Type' : 'application/json',
              'x-auth-token' : localStorage.getItem("xAuthToken")
            });
            return this.http.post(url, quiz, {headers: tokenHeader});
          }

          downlod(){

            this.httpClient.get<any>("http://localhost:8181/quizmaker/getAudio/118/252_Question_Audio.mp3", { responseType: 'blob' as 'json' });
          }

  addBlobQuestion(quizIndex:number,question:Question,blobObject:BlobQuestionMap[]){
     let url ='';
     console.log(blobObject,question);
     let formData = new FormData();
    switch(question.question_type) { 
      case 'Audio': { 
        url = AppConst.serverPath+"/quizmaker/add/audio/"+quizIndex+"/"+question.questionSeq+"_Question_"+question.question_type;
        blobObject.forEach(audioFile =>{
            if(audioFile.questionSeq === question.questionSeq ){
              formData.append("audioQuestion", audioFile.file);

            }
        })
            
        break; 
      } 
      case 'Video': { 
        url = AppConst.serverPath+"/quizmaker/add/video/"+quizIndex+"/"+question.questionSeq+"_Question_"+question.question_type; 
        blobObject.forEach(videoFile =>{
          if(videoFile.questionSeq === question.questionSeq ){
            formData.append("videoQuestion", videoFile.file);

          }
      })
        
      //  formData.append("videoQuestion", blobObject[question.questionSeq-1].file);
        break; 
      } 
      case 'Image': { 
        url = AppConst.serverPath+"/quizmaker/add/image/"+quizIndex+"/"+question.questionSeq+"_Question_"+question.question_type; 
        
        blobObject.forEach(imageFile =>{
          if(imageFile.questionSeq === question.questionSeq ){
            formData.append("picture", imageFile.file);

          }
      })
        
        //formData.append("picture", blobObject[question.questionSeq-1].file); 
        break; 
      } 
      default: { 
         //statements; 
         break; 
      } 
   } 
 
   
   return this.httpClient.post(url,formData);

  }

  addBlobAnswer(quiz:Quiz,response : Answers,question:Question,blobAnswerSet : BlobAnswer[]){
    let url ='';   let formData = new FormData();
    console.log(response,blobAnswerSet);

    blobAnswerSet.forEach(blobAns=>{

      if(blobAns.questionSeq === question.questionSeq){
        url = AppConst.serverPath+"/quizmaker/add/image/"+quiz.quizIndex+"/"+question.questionSeq+"_"+response.responseSeq+"_Answer_Image.png";  
        blobAns.answerBlob.forEach(uploadBlobAns=>{
            if((uploadBlobAns.responseSeq+1) === response.responseSeq ){
              console.log(uploadBlobAns.file);
              formData.append("picture", uploadBlobAns.file);
            }
        });
        
      
      }
      


    });
    return this.httpClient.post(url,formData);

 }


  saveActivity(activity : Activity){
console.log(JSON.stringify(activity));
    let url = AppConst.serverPath+"/quizmaker/addActivity";
    let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem("xAuthToken")
  	});
  	return this.http.post(url, JSON.stringify(activity), {headers: tokenHeader});
  }

  updateActivity(updateActivity : Activity){
    console.log(updateActivity);
        let url = AppConst.serverPath+"/quizmaker/updateActivity";
        let tokenHeader = new Headers({
          'Content-Type' : 'application/json',
          'x-auth-token' : localStorage.getItem("xAuthToken")
        });
        return this.http.post(url, JSON.stringify(updateActivity), {headers: tokenHeader});
      }

  deleteActivity(activityId : number){
    console.log(activityId);
        let url = AppConst.serverPath+"/quizmaker/deleteActivity/"+activityId;
        let tokenHeader = new Headers({
          'Content-Type' : 'application/json',
          'x-auth-token' : localStorage.getItem("xAuthToken")
        });
        return this.http.get(url,  {headers: tokenHeader});
      }

      deleteQuiz(quizId : number){
        console.log(quizId);
            let url = AppConst.serverPath+"/quizmaker/deleteQuiz/"+quizId;
            let tokenHeader = new Headers({
              'Content-Type' : 'application/json',
              'x-auth-token' : localStorage.getItem("xAuthToken")
            });
            return this.http.get(url,  {headers: tokenHeader});
          }

          deleteSurvey(surveyId : number){
            console.log(surveyId);
                let url = AppConst.serverPath+"/quizmaker/deleteSurvey/"+surveyId;
                let tokenHeader = new Headers({
                  'Content-Type' : 'application/json',
                  'x-auth-token' : localStorage.getItem("xAuthToken")
                });
                return this.http.get(url,  {headers: tokenHeader});
              }

      getQuizResultByUser(userid) {
        let url = AppConst.serverPath+"/quizmaker/getResultByUserId/"+userid;

        let tokenHeader = new Headers({
          'Content-Type' : 'application/json',
          'x-auth-token' : localStorage.getItem("xAuthToken")
        });
        return this.http.get(url, {headers: tokenHeader});
      }

      getQuizByIndex(quizIndex) {
        let url = AppConst.serverPath+"/quizmaker/getQuizByIndex/"+quizIndex;

        let tokenHeader = new Headers({
          'Content-Type' : 'application/json',
          'x-auth-token' : localStorage.getItem("xAuthToken")
        });
        return this.http.get(url, {headers: tokenHeader});
      }

      getSurveyByIndex(surveyIndex) {
        let url = AppConst.serverPath+"/quizmaker/getSurveyByIndex/"+surveyIndex;

        let tokenHeader = new Headers({
          'Content-Type' : 'application/json',
          'x-auth-token' : localStorage.getItem("xAuthToken")
        });
        return this.http.get(url, {headers: tokenHeader});
      }

      getSurveyParticipation(userId , surveyIndex) {
        let url = AppConst.serverPath+"/quizmaker/getSurveyParticipated/"+userId+"/"+surveyIndex;

        let tokenHeader = new Headers({
          'Content-Type' : 'application/json',
          'x-auth-token' : localStorage.getItem("xAuthToken")
        });
        return this.http.get(url, {headers: tokenHeader});
      }

      getQuizMaxAttempt(userId,quizIndex) {
        let url = AppConst.serverPath+"/quizmaker/getQuizEligibility/"+userId+"/"+quizIndex;

        let tokenHeader = new Headers({
          'Content-Type' : 'application/json',
          'x-auth-token' : localStorage.getItem("xAuthToken")
        });
        return this.http.get(url, {headers: tokenHeader});
      }


      getCategoryList() {
        let url = AppConst.serverPath+"/quizmaker/categories";

        let tokenHeader = new Headers({
          'Content-Type' : 'application/json',
          'x-auth-token' : localStorage.getItem("xAuthToken")
        });
        return this.http.get(url, {headers: tokenHeader});
      }


      getQuizByCategory(categoryId) {
        let url = AppConst.serverPath+"/quizmaker/getQuizUserByCategory/"+categoryId;

        let tokenHeader = new Headers({
          'Content-Type' : 'application/json',
          'x-auth-token' : localStorage.getItem("xAuthToken")
        });
        return this.http.get(url, {headers: tokenHeader});
      }

      getResultByCategory(categoryId:number) {
        let url = AppConst.serverPath+"/quizmaker/getResultByCategory/"+categoryId;

        let tokenHeader = new Headers({
          'Content-Type' : 'application/json',
          'x-auth-token' : localStorage.getItem("xAuthToken")
        });
        return this.http.get(url, {headers: tokenHeader});
      }


      getResultByQuiz(quizId:number) {
        let url = AppConst.serverPath+"/quizmaker/getResultByQuizId/"+quizId;

        let tokenHeader = new Headers({
          'Content-Type' : 'application/json',
          'x-auth-token' : localStorage.getItem("xAuthToken")
        });
        return this.http.get(url, {headers: tokenHeader});
      }

      getStatewiseResultByCategory(categoryId:number) {
        let url = AppConst.serverPath+"/quizmaker/getStatewiseResultByCategory/"+categoryId;

        let tokenHeader = new Headers({
          'Content-Type' : 'application/json',
          'x-auth-token' : localStorage.getItem("xAuthToken")
        });
        return this.http.get(url, {headers: tokenHeader});
      }

      getCityWiseResultByQuizId(quizid,state){

        let url = AppConst.serverPath+"/quizmaker/getCityWiseResult/"+quizid+"/"+state;

        let tokenHeader = new Headers({
          'Content-Type' : 'application/json',
          'x-auth-token' : localStorage.getItem("xAuthToken")
        });
        return this.http.get(url, {headers: tokenHeader});



      }
      getCityWiseResultAll(state){

        let url = AppConst.serverPath+"/quizmaker/getCitywiseResult/"+state;

        let tokenHeader = new Headers({
          'Content-Type' : 'application/json',
          'x-auth-token' : localStorage.getItem("xAuthToken")
        });
        return this.http.get(url, {headers: tokenHeader});



      }


      getAllQuizResult() {
        let url = AppConst.serverPath+"/quizmaker/getAllResult";

        let tokenHeader = new Headers({
          'Content-Type' : 'application/json',
          'x-auth-token' : localStorage.getItem("xAuthToken")
        });
        return this.http.get(url, {headers: tokenHeader});
      }

      getStateWiseQuizResult() {
        let url = AppConst.serverPath+"/quizmaker/getStatewiseResult";

        let tokenHeader = new Headers({
          'Content-Type' : 'application/json',
          'x-auth-token' : localStorage.getItem("xAuthToken")
        });
        return this.http.get(url, {headers: tokenHeader});
      }

      saveCategory(category : Category){
    console.log(JSON.stringify(category));
        let url = AppConst.serverPath+"/quizmaker/addCategory";
        let tokenHeader = new Headers({
          'Content-Type' : 'application/json',
          'x-auth-token' : localStorage.getItem("xAuthToken")
        });
        return this.http.post(url, JSON.stringify(category), {headers: tokenHeader});
      }

      updateCategory(updateCategory : Category){
        console.log(updateCategory);
            let url = AppConst.serverPath+"/quizmaker/updateCategory";
            let tokenHeader = new Headers({
              'Content-Type' : 'application/json',
              'x-auth-token' : localStorage.getItem("xAuthToken")
            });
            return this.http.post(url, JSON.stringify(updateCategory), {headers: tokenHeader});
          }

      deleteCategory(categoryId : number){
        console.log(categoryId);
            let url = AppConst.serverPath+"/quizmaker/deleteCategory/"+categoryId;
            let tokenHeader = new Headers({
              'Content-Type' : 'application/json',
              'x-auth-token' : localStorage.getItem("xAuthToken")
            });
            return this.http.get(url,  {headers: tokenHeader});
          }



  getBook(id:number) {
  	let url = AppConst.serverPath+"/book/"+id;

  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem("xAuthToken")
  	});
  	return this.http.get(url, {headers: tokenHeader});
  }

  searchBook(keyword:string) {
  	let url = AppConst.serverPath+"/book/searchBook";

  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem("xAuthToken")
  	});
  	return this.http.post(url, keyword, {headers: tokenHeader});
  }

  getLastBookId(){

    let url = AppConst.serverPath+"/book/getLastBookId";

  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem("xAuthToken")
  	});
  	return this.http.get(url, {headers: tokenHeader});

  }

  get(url: string) {
    return this.httpClient.get(url);
  }

  getAll() {
    return [
      { id: 'assets/data/javascript.json', name: 'JavaScript' },
      { id: 'assets/data/aspnet.json', name: 'Asp.Net' },
      { id: 'assets/data/csharp.json', name: 'C Sharp' },
      { id: 'assets/data/designPatterns.json', name: 'Design Patterns' },
      { id: 'assets/data/bollywoodQuiz.json', name: 'BollyWood Quiz' },
      { id: 'assets/data/bollywood90s.json', name: 'BollyWood Quiz 90s' }
    ];
  }

}
