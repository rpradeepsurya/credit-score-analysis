import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_BASE_URL = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  submitFeedback(feedback: any) {
    return this.http.post(`${this.API_BASE_URL}/feedback`, feedback);
  }

  makePrediction(formData: any) {
    return this.http.post(`${this.API_BASE_URL}/predict`, formData);
  }

  makeBatchPrediction(formData: any) {
    return this.http.post(`${this.API_BASE_URL}/predict_batch`, formData);
  }
}
