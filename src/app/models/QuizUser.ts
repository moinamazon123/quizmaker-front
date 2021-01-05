import { Question } from './Question';

export class QuizUser {

    public id :number;
    public userId :number;
    public quiz_id:number;
    public survey_id:number;
    public surveyParticipated:boolean;
    public  max_attempt_left:number;
    public  max_attempt:number;
    public quiz_category_id : number;
    public score:number;
    public grade:string;
    public result:string;
    public percentage:string;
    public completion_time:string;
    public completion_date : string;
    public quizDesign:number;
    public questionDifficulty:number;
    public timeConstraint:number;
    public questionList : Question[];



}