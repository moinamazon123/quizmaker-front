import { User } from "./user";

export class Audit {
  public  audit_id : number;

  public audit_event : string;

  public date_created : string;

  public time_created : string;


  public date_updated : string;

  public time_updated : string;

  public user : User;

  public userId : number;


}
