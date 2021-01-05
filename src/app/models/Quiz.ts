
import { Question } from './Question';
import { Category } from './Category';
import { QuizSetting } from './QuizSetting';
import { Grade } from './Grade';
import { Audit } from './Audit';
import { Activity } from './Activity';

export class Quiz {
    id: number;
    name: string;
    description: string;
    quizIndex : number ;
    surveyIndex:number;
    randomQuestions:number;

  public quiz_title : string;
  public level : string;
  public introduction_message : string;
  public conclusion_message : string;
  public max_attempt : number;
  public show_answer : boolean =false;
  public show_score : boolean =false;
  answered:boolean =false;
  public time : number;
  public category : Category;
 /**  public reviewer : User;
  public invigilator:User; **/
  public reviewer: number;
  public invigilator:number;
  public assigneeUserIdList:string;
  public assigneeCityList:string;
  public assigneeStateList:string;
  public assigneeRoleList:string;
  public questionList : Question[];
  public quizSetting: QuizSetting;
  public blobQuestion : File;
  public gradeList:Grade[];
  public grade : Grade;
  public status : string;
  public creator : number;
  public passMark : number;
  public scheduleDateTime : string;
  public date_schedule : string;
  public time_schedule : string;
  public comment : string;
  public activity:Activity;

  public audit : Audit;

   
}
