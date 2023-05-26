import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
  isLoading: boolean;

  constructor(private apiService: ApiService) {
    this.apiService.loadingStatus.subscribe(status => this.isLoading = status);
  }

  ngOnInit(): void {
  }
}
