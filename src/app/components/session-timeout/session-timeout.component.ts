import { OnInit, Component, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AppConst } from 'src/app/constants/app-const';

@Component({
    selector: 'session-warning',
    templateUrl: './session-timeout.component.html',
    styleUrls: ['./session-timeout.component.css']
  })
export class SessionTOComponent  implements OnInit {
   
    @Input('username') username:string;
    @Input('userid') userid:number;
    @Input('timer') timer:number;
    @Input('sesionExpiryflag')  sesionExpiryflag: boolean;
    @Input('sesionWarningflag')  sesionWarningflag: boolean;
    @Output() public timerreset =  new EventEmitter<{timerreset:number ,showdialog:boolean}>(); 
   
    ngOnInit(): void {
       // document.getElementById("sessionTOModal").style.display ='block';
        console.log(this.username ,this.userid,this.timer );
    }
   
    resetTimer() 
    { 
      
    /* we will wrap the parameters  
       to be sent inside the curly brackets.*/
      
      this.timerreset.emit({timerreset:0 , showdialog : false}); 
    } 

    continueSession(){

        this.setWithExpiry("username", this.username, AppConst.sessionActive * 60*1000);
        this.setWithExpiry("userId",  this.userid , AppConst.sessionActive * 60*1000);
        this.timerreset.emit({timerreset:0,showdialog:false}); 
        this.close();
      }
      setWithExpiry(key, value, ttl) {
        const now = new Date()
      
        // `item` is an object which contains the original value
        // as well as the time when it's supposed to expire
        const item = {
          value: value,
          expiry: now.getTime() + ttl,
        }
        localStorage.setItem(key, JSON.stringify(item))
      }

      close(){
      this.sesionWarningflag = false;    
      this.sesionExpiryflag = false;

      

      }

}