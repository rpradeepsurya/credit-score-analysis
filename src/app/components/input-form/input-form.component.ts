import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-input-form',
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.css']
})
export class InputFormComponent {
  feature1: number;
  // Add more features as needed

  constructor(private apiService: ApiService, private router: Router) { }

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
}
