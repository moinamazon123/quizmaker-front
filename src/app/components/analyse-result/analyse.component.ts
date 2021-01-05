import { Component } from '@angular/core';
 
@Component({
  selector: 'analyse-result',
  templateUrl: './analyse.component.html'
})
export class AnalyseResultComponent {
  // Doughnut
  public doughnutChartLabels:string[] = ['PASS','FAIL'];
  public demodoughnutChartData:number[] = [100,5];
  public doughnutChartType:string = 'doughnut';
 
  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }
}