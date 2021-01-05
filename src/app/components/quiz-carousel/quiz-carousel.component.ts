

import { Component } from '@angular/core';

@Component({
  selector: 'quiz-carousel',
  templateUrl: './quiz-carousel.component.html',
  styleUrls: ['./quiz-carousel.component.css']
})
export class QuizCarouselComponent {

  slideIndex:number = 1;
  slideIndex1:number = 0;
  flag:boolean=false;



  ngOnInit() {
    //setInterval(() => this.autoSlides,1000);
   this.showSlides(this.slideIndex);
  // this.autoSlides();

 }

  plusSlides(n:number) {
   this.showSlides(this.slideIndex += n);
 }

  currentSlide(n:number) {
   this.showSlides(this.slideIndex = n);
 }

  showSlides(n:number) {

   let i;
   let slides = document.getElementsByClassName("mySlides");
   let dots = document.getElementsByClassName("dot");
   if (n > slides.length) {this.slideIndex = 1}
   if (n < 1) {this.slideIndex = slides.length}
      for (i = 0; i < slides.length; i++) {
     console.log("image"+i);

      document.getElementById("image"+i).style.display = "none";


       this.flag = false;
   }
   for (i = 0; i < dots.length; i++) {
       dots[i].className = dots[i].className.replace(" active", "");
   }
  // slides[this.slideIndex-1].className+= " showStyle";
  console.log("image"+(this.slideIndex-1));
   document.getElementById("image"+(this.slideIndex-1)).style.display = "block";
   this.flag = true;
   dots[this.slideIndex-1].className += " active";


 }

  autoSlides() {
   let i;
   let slides = document.getElementsByClassName("mySlides");
   let dots = document.getElementsByClassName("dot");
   for (i = 0; i < slides.length; i++) {
     document.getElementById("image"+i).style.display = "none";
   }
   this.slideIndex1++;
   if (this.slideIndex1 > slides.length) {this.slideIndex1 = 1}
   for (i = 0; i < dots.length; i++) {
     dots[i].className = dots[i].className.replace(" active", "");
   }
   document.getElementById("image"+(this.slideIndex1-1)).style.display = "block";
   dots[this.slideIndex1-1].className += " active";
   //setTimeout(this.autoSlides, 2000); // Change image every 2 seconds
 }



}

