import { Audit } from './Audit';
import { SurveyQuestion } from './SurveyQuestion';

export class SurveyUser {

    public id:number;
    public userId:number;
    public surveyParticipated:boolean;
    public survey_id:number;
    public completion_time:string;
    public surveyQuestionSet : SurveyQuestion[];
    public audit : Audit;
    


}