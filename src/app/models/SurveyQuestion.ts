import { SurveyUser } from './SurveyUser';
import { Audit } from './Audit';

export class SurveyQuestion{

    public id:number;
    public question_type:string;
    public questionFlag:string;
    public survey_question : string;
    public response:string;
    public rating:number;
    public audit : Audit;

}