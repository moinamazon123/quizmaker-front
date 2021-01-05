import { Question } from "./Question";

export class Answers{

id:number;

response:string;
//question:Question;
//question_id:number;
question:Question;
correctAnswerFlag:boolean;
blobAnswer : File;
selected:boolean;
responseSeq : number;
blobUrl:string;
surveyTextOption:boolean;
surveyRatingOption:boolean;
surveyText:string;
rating:number;

}
