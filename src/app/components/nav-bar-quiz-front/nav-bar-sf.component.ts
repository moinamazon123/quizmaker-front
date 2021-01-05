import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';



@Component({
  selector: 'app-nav-bar-quizmaker',
  templateUrl: './nav-bar-sf.component.html',
  styleUrls: ['./nav-bar-sf.component.css']
})
export class NavBarComponentQuizFront implements OnInit {

  private loggedIn = false;
  private cartItemNumber : string;

  constructor( private router: Router) { }


  ngOnInit() {

  }



}
