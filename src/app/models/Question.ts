import { Audit } from "./Audit";
import { User } from "./user";
import { Feedback } from "./Feedback";
import { Answers } from "./Answers";


export class Question {

  public id:number;
  public question_type:string;
  public question_title:string;
  public question_mark:number;
  public questionSeq : number;
  public feedBack : Feedback;
  public responseList : Answers[];
  public blobAnswer :File[];
  public blobQuestion : File;
  public audit: Audit;
  public blobUrl: string;
  public blobObjectUrl: any;
  public answered:boolean;


}
