import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  fileName: string | null = null;

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
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
    // Call your API here to upload the file and make batch predictions
    this.apiService.makeBatchPrediction(file).subscribe(response => {
      console.log(response);

    }, error => {
      console.error('Error:', error);

    });
  }
}
