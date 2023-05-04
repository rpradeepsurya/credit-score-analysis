import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent {
  name: string;
  email: string;
  feedback: string;

  constructor(private apiService: ApiService) { }

  onSubmit(form: any): void {
    if (form.valid) {
      const feedbackData = {
        name: this.name,
        email: this.email,
        feedback: this.feedback
      };

      this.apiService.submitFeedback(feedbackData).subscribe(response => {
        // Handle successful feedback submission
        alert('Thank you for your feedback!');
        form.reset();
      }, error => {
        console.error('Error:', error);
      });
    }
  }
}
