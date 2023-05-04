import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { trigger, style, transition, animate } from '@angular/animations';
import * as Plotly from 'plotly.js';

@Component({
  selector: 'app-input-form',
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.5s ease-in', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class InputFormComponent {
  feature1: number;
  // Add more features as needed

  constructor(private apiService: ApiService, private router: Router) { 

    // this.displayProbabilities([0.2, 0.8, 0.45]);

  }

  ngOnInit(): void {
    this.displayProbabilities([0.2, 0.5, 0.3]);
  }

  onSubmit(form: any): void {
    if (form.valid) {
      const inputData = {
        feature1: this.feature1
        // Add more features as needed
      };

      this.apiService.makePrediction(inputData).subscribe(response => {
        // Pass the prediction results to the ResultsComponent
        this.router.navigate(['/results'], { state: { results: response } });
      }, error => {
        console.error('Error:', error);
      });
    }
  }

  displayProbabilities(probabilities: number[]) {
    const data: Plotly.Data[] = [
      {
        type: 'bar',
        x: probabilities,
        y: ['Good', 'Poor', 'Standard'],
        orientation: 'h',
      },
    ] as any as Plotly.Data[];
  
    const layout = {
      autosize: true,
      title: {
        text: 'Model Predictions',
        font: {
          family: 'Roboto, sans-serif',
          size: 24,
          color: 'black',
          fontWeight: 'bold',
        },
      },
      xaxis: {
        title: 'Probability',
        range: [0, 1]
      },
      yaxis: {
        title: 'Category',
      },
    };

    const config = {
      responsive: true,
    };
  
    Plotly.newPlot('plot-container', data, layout, config);
  }

}
