import { Component, OnInit } from '@angular/core';
import {LoginService} from "../../services/login.service";
import {AppConst} from '../../constants/app-const';
import {Router} from "@angular/router";
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import  *  as  data  from  '../../country.json';
import  *  as  citiesJson from  '../../indian-cities.json';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class QuizRegisterComponent implements OnInit {

     user : User =new User();
     userIn : boolean = false;
     checkEmailExistsFlag : boolean = false;
     checkUsernameExistsFlag : boolean = false;
     passwordCheckFlag : boolean = false;
     loading = false;
     countrydata: any = (data as any).default;
     citiesData : any = (citiesJson as any).default;
     countriesdata:any[]=[];
     states:any[]=[];
     cities: any[] =[];

  constructor(private router:Router,private userService:UserService){

  }

  ngOnInit() {
let countryList=[];
let stateList =[];
this.countrydata.countries.forEach(function (value) {
  countryList.push(value['country']);
  //stateList.push(value['states']);
  //console.log(  this.countries,this.states);
}); 
this.countriesdata = countryList;
this.states = stateList;
console.log(  countryList,stateList);
  }

  populateState(){
    let stateList =[];
    let user:User=new User();
   user.country = this.user.country;
    this.countrydata.countries.forEach(function (value) {
      if(value['country'] === user.country){
        stateList.push(value['states']);
      }
    });
    this.states = stateList[0];
    console.log( this.user.country, stateList[0].length);

  }
  populateCities(){
    let cityList =[];
    let user:User=new User();
   user.state = this.user.state;
    this.citiesData.forEach(function (value) {
      if(value['state'] === user.state){
        cityList .push(value['name']);
      }
    });
    this.cities = cityList;
    console.log( this.cities);

  }

  checkEmailExists(){
console.log(this.user.email);
    this.userService.checkEmail(this.user.email).subscribe(
      res => {
      console.log(res['_body']);
      
      },
      error => {
        this.userIn=false;
      }
    );

  }

  checkUserExists(){

    this.userService.checkUsername(this.user.username).subscribe(
      res => {
      console.log(res);
      if(res['_body'] === 'usernameExists'){
        this.checkUsernameExistsFlag = true;
      }
      },
      error => {
        this.userIn=false;
      }
    );

  }

  passwordMatch(){

if(this.user.password !== this.user.cpassword){
  this.passwordCheckFlag = true;
}else {
  this.passwordCheckFlag = false;
}


  }
  onSubmit(){
   console.log(this.user) ;
this.loading = true;
   this.userService.newUser(this.user).subscribe(
    res => {
      console.log(res['_body']);
      if(res['_body'] === 'usernameExists'){
        this.checkUsernameExistsFlag = true;
        this.checkEmailExistsFlag = false;
        this.passwordCheckFlag = false;
        this.userIn=false;
      }
      if(res['_body'] === 'emailExists'){
        this.checkEmailExistsFlag = true;
        this.checkUsernameExistsFlag = false;
        this.passwordCheckFlag = false;
        this.userIn=false;
      }
      if(res['_body'] === 'User Added Successfully!'){
        this.userIn=true;
        this.checkUsernameExistsFlag = false;
        this.checkEmailExistsFlag = false;
        this.passwordCheckFlag = false;
      }
      this.loading = false;
      
    },
    error => {
      this.userIn=false;
    }
  );

  }

}
