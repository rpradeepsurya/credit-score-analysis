import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  fileName: string | null = null;

  constructor(
    private apiService: ApiService, 
    private router: Router,
    private http: HttpClient) { }

  ngOnInit(): void {
  }

  downloadTemplate() {
    const fileName = 'template.csv';
    const apiUrl = '../../../assets/template.csv'; 
  
    this.http.get(apiUrl, { responseType: 'blob' }).subscribe((data: Blob) => {
      saveAs(data, fileName);
    }, error => {
      console.error('Error downloading the file.', error);
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.item(0);
    if (file) {
      if (file.type === 'text/csv') {
        this.fileName = file.name;
        this.uploadFile(file);
      } else {
        this.fileName = null;
        alert('Please upload a valid CSV file.');
      }
    }
  }

  uploadFile(file: File): void {
    this.apiService.setLoading(true);
    // Call your API here to upload the file and make batch predictions
    this.apiService.makeBatchPrediction(file).subscribe(response => {
      console.log(response);
      this.apiService.setLoading(false);
    }, error => {
      console.error('Error:', error);
      this.apiService.setLoading(false);
    });
  }
}
