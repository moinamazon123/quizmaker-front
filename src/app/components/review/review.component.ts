import { OnInit, Component, Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { QuizUser } from 'src/app/models/QuizUser';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
    selector: 'review',
    templateUrl: './review.component.html',
    styleUrls: ['./review.component.css']
  })
export class ReviewComponent implements OnInit{
  @Input("quizUser") quizUser : QuizUser;
  @Input("autoSubmit") autoSubmit : boolean;
  rating3: number;
  message : string;
  public form: FormGroup;

  constructor(private fb: FormBuilder,private quizService: QuizService){
   
   
    this.rating3 = 0;
    this.form = this.fb.group({
      rating1: ['', Validators.required],
      rating2: ['', Validators.required],
      rating3: [4]
    });
  }



  ngOnInit() {
    console.log(this.autoSubmit,this.quizUser);
    let quizUser :QuizUser = new QuizUser();
    quizUser = this.quizUser;
    if(this.autoSubmit){
     quizUser.questionDifficulty=0;
     quizUser.timeConstraint=0;
      quizUser.quizDesign=0;
      //quizUser.completion_time=this.quizUser.completion_time;
     
      console.log(JSON.stringify(quizUser));
      this.autoSubmitQuiz(quizUser);
    }

  }
  autoSubmitQuiz(quizUser){

    console.log(quizUser);

    this.quizService.submitQuiz(quizUser).subscribe( res =>{

        this.message = res["_body"];
    },
    error => {
     console.log(error.json());
    }
  );


  }

  submitQuiz(){

    console.log(this.quizUser);

    this.quizService.submitQuiz(this.quizUser).subscribe( res =>{

        this.message = res["_body"];
    },
    error => {
     console.log(error.json());
    }
  );


  }
}