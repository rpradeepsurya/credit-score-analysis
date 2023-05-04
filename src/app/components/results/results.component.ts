import { Component, OnInit } from '@angular/core';
import * as Plotly from 'plotly.js';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  results: any;

  constructor() {

    const state = history.state as { results: any };
    this.results = state.results;
   }

  ngOnInit(): void {
    this.renderPlot();
  }

  renderPlot(): void {
    // Replace this with the actual data from the XGBoost model prediction
    const data: Plotly.Data[] = [
      {
        x: ['Class 1', 'Class 2', 'Class 3'],
        y: this.results.probabilities,
        type: 'bar' as const, // Cast the type to 'bar'
        marker: {
          color: ['#1f77b4', '#ff7f0e', '#2ca02c']
        }
      }
    ];
  
    const layout: Partial<Plotly.Layout> = {
      title: 'Prediction Results',
      xaxis: {
        title: 'Classes'
      },
      yaxis: {
        title: 'Probability'
      }
    };
  
    Plotly.newPlot('results-plot', data, layout);
  }
  

}
