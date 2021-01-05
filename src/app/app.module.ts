
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpModule } from '@angular/http';
import { routing }  from './app.routing';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { AppComponent } from './app.component';

import { RadioButtonModule } from '@syncfusion/ej2-angular-buttons';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import {LoginService} from './services/login.service';

import { QuizLogInComponent } from './components/quiz-login/log-in.component';
import { QuizRegisterComponent } from './components/register/register.component';
import { IndexQuizFront } from './components/index/index.component';
import { ChartComponent } from './components/chart/chart.component';

import { ActivityComponent } from './components/activity/activity.component';
import { QuizService } from './services/quiz.service';
import { PaginationComponent } from './components/pagination/pagination.component';
import { CategoryComponent } from './components/categories/categories..component';
import { QuizCarouselComponent } from './components/quiz-carousel/quiz-carousel.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { NavBarComponentQuizFront } from './components/nav-bar-quiz-front/nav-bar-sf.component';
import { SideBarComponent } from './components/side-bar/sidebar.component';
import { UserService } from './services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { ActivityLogComponent } from './components/activityLog/activityLog.component';
import { ActivityLogService } from './services/activity-log.service';
//import { CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
//import { CheckboxModule, WavesModule, ButtonsModule } from 'angular-bootstrap-md'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // If You need animations
import { RoleComponent } from './components/role-manaement/role-assignment';
import { QuizBank } from './components/questionBank/qBank.component';
import { QuizPlayComponent } from './components/quiz-play/quiz-play.component';
import { ReviewComponent } from './components/review/review.component';
import { NgxStarRatingModule } from 'ngx-star-rating';
import { SessionTOComponent } from './components/session-timeout/session-timeout.component';
import { AnalyseResultComponent } from './components/analyse-result/analyse.component';
import { QuizNotificationComponent } from './components/quiz-notification/quiznotification.component';
import { SurveyComponent } from './components/survey/survey.component';
import { SurveyPlayComponent } from './components/survey-play/survey-play.component';
import { MessageComponent } from './components/message-center/message.component';
import { ProfileComponent } from './components/profile/profile.component';

@NgModule({
  declarations: [

    NavBarComponentQuizFront,
    QuizRegisterComponent,
    QuizLogInComponent,
    IndexQuizFront,
    ChartComponent,
    SideBarComponent,
    ActivityComponent,
    PaginationComponent,
    CategoryComponent,
    QuizCarouselComponent,
    QuizComponent,
    ActivityLogComponent,
    SessionTOComponent,
    AppComponent,
    RoleComponent,
    QuizBank,
    QuizPlayComponent,
    ReviewComponent,
    AnalyseResultComponent,
    ActivityLogComponent,
    QuizNotificationComponent,
    SurveyComponent,
    SurveyPlayComponent,
    MessageComponent,
    ProfileComponent

  ],
  imports: [
    //MDBBootstrapModule.forRoot(),
    //BrowserAnimationsModule,  
    BrowserModule,
    HttpClientModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    NgxStarRatingModule,
    RadioButtonModule,
    routing


  ],
  providers: [
    QuizService,

    CookieService,
    LoginService,
    UserService,
    ActivityLogService

  ],
  bootstrap: [AppComponent],

  schemas: [ CUSTOM_ELEMENTS_SCHEMA , NO_ERRORS_SCHEMA ]
})
export class AppModule { }
