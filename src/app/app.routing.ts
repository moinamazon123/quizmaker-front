import { QuizComponent } from './components/quiz/quiz.component';
import { CategoryComponent } from './components/categories/categories..component';
import { ActivityComponent } from './components/activity/activity.component';
import { QuizRegisterComponent } from './components/register/register.component';
/**
 * Created by z00382545 on 1/16/17.
 */
import {ModuleWithProviders}  from '@angular/core';
import {Routes, RouterModule} from '@angular/router';


import { QuizLogInComponent } from './components/quiz-login/log-in.component';
import { IndexQuizFront } from './components/index/index.component';
import { PaginationComponent } from './components/pagination/pagination.component';

import { QuizCarouselComponent } from './components/quiz-carousel/quiz-carousel.component';
import { RoleComponent } from './components/role-manaement/role-assignment';
import { QuizBank } from './components/questionBank/qBank.component';
import { QuizPlayComponent } from './components/quiz-play/quiz-play.component';
import { ReviewComponent } from './components/review/review.component';
import { SessionTOComponent } from './components/session-timeout/session-timeout.component';
import { AnalyseResultComponent } from './components/analyse-result/analyse.component';
import { ChartComponent } from './components/chart/chart.component';
import { QuizNotificationComponent } from './components/quiz-notification/quiznotification.component';
import { SurveyComponent } from './components/survey/survey.component';
import { SurveyPlayComponent } from './components/survey-play/survey-play.component';
import { MessageComponent } from './components/message-center/message.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ActivityLogComponent } from './components/activityLog/activityLog.component';


const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },

  {
    path: 'login',

    component: QuizLogInComponent
  },
  {
    path: 'register',

    component: QuizRegisterComponent
  },
  {
    path: 'activity',

    component: ActivityComponent
  },
  {
    path: 'index',

    component: IndexQuizFront
  },
  {
    path: 'datatable',

    component: PaginationComponent

  },
  {
    path: 'categories',

    component: CategoryComponent

  },
  {
    path: 'quizCarousel',

    component: QuizCarouselComponent

},
{
  path: 'quizCreate',

  component: QuizComponent

},
{
  path: 'role-management',

  component: RoleComponent

},
{
  path: 'questionBank',

  component: QuizBank

},
{
  path: 'quiz-play/:quizIndex',

  component: QuizPlayComponent

},
{
  path: 'quiz-preview/:quizIndex',

  component: QuizPlayComponent

},
{
  path: 'activityLog-comp',

  component: ActivityLogComponent

},


{
  path: 'profile',

  component: ProfileComponent

},
{
  path: 'survey-play/:surveyIndex',

  component: SurveyPlayComponent

},
{
  path: 'survey-preview/:surveyIndex',

  component: SurveyPlayComponent

},
{
  path: 'message-center',

  component: MessageComponent

},

{
  path: 'quiz-review',

  component: ReviewComponent

}
,{
  path: 'sessionwarining',

  component: SessionTOComponent

},
{
  path: 'analyseResult',

  component: AnalyseResultComponent

},
{
  path: 'analysis',

  component: ChartComponent

},
{
  path: 'survey',

  component: SurveyComponent

},
{
  path: 'quiz-notification/:flag',

  component: QuizNotificationComponent

}



];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
