import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_BASE_URL = environment.apiBaseUrl;
  loadingStatus: Subject<boolean> = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  setLoading(status: boolean): void {
    this.loadingStatus.next(status);
  }

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
