import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl']
})
export class AppComponent implements OnInit{
 
  title = 'quizmaker-front';
  env : string;

  ngOnInit(): void {
    this.env = environment.environment;
    console.log(this.env);
    if (this.env ==='Local') {
      //enableProdMode();
     // window.console.log = function () { };   // disable any console.log debugging statements in production mode
      // window.console.error = function () { };
    
    }
  }

}
