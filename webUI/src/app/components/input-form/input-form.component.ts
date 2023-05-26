import { Component, NgZone, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { trigger, style, transition, animate } from '@angular/animations';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PlotModalComponent, DialogData } from '../plot-modal/plot-modal.component';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import * as Plotly from 'plotly.js';

@Component({
  selector: 'app-input-form',
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.css'],
  providers: [
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { closeOnNavigation: true, disableClose: true } }
  ],
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
  @ViewChild('focusableContainer', { static: false }) focusableContainer: ElementRef;
  age: number;
  month: string;
  monthlySalary: number;
  numBankAcc: number;
  numCC: number;
  interestRate: number;
  numLoan: number;
  numDPay: number;
  dueDelay: number;
  debt: number;
  cMix: string;
  payMin: string;
  showPlot: boolean = false;
  inputData: any;
  plotElement: any;
  summaryPlotHtml: SafeHtml;
  forcePlotHtml: SafeHtml;
  summary_data: any;
  force_data: any;
  summary_base64: any;
  force_base64: any;

  monthList: Array<string> = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December']


  constructor(
    private apiService: ApiService,
    private router: Router,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.displayProbabilities([0, 0, 0]);
  }

  onSubmit(form: any): void {
    if (form.valid) {
      this.inputData = {
        Month: this.month,
        Age: this.age,
        Monthly_Inhand_Salary: this.monthlySalary,
        Num_Bank_Accounts: this.numBankAcc,
        Num_Credit_Card: this.numCC,
        Interest_Rate: this.interestRate,
        Num_of_Loan: this.numLoan,
        Credit_Mix_Bad: 0,
        Credit_Mix_Good: 0,
        Credit_Mix_Standard: 0,
        Credit_Mix_Unknown: 0,
        Num_of_Delayed_Payment: this.numDPay,
        Delay_from_due_date: this.dueDelay,
        Outstanding_Debt: this.debt,
        Payment_of_Min_Amount_NM: 0,
        Payment_of_Min_Amount_No: 0,
        Payment_of_Min_Amount_Yes: 0

      };

      if (this.cMix == "Good") {
        this.inputData["Credit_Mix_Good"] = 1
      } else if (this.cMix == "Bad") {
        this.inputData["Credit_Mix_Bad"] = 1
      } else if (this.cMix == "Standard") {
        this.inputData["Credit_Mix_Standard"] = 1
      }
      else {
        this.inputData["Credit_Mix_Unknown"] = 1
      }

      if (this.payMin == "Yes") {
        this.inputData["Payment_of_Min_Amount_Yes"] = 1
      } else if (this.payMin == "No") {
        this.inputData["Payment_of_Min_Amount_No"] = 1
      }
      else {
        this.inputData["Payment_of_Min_Amount_NM"] = 1
      }

      this.apiService.setLoading(true);
      this.apiService.makePrediction(this.inputData).subscribe((response: any) => {
        // Pass the prediction results to the ResultsComponent
        console.log("Response")
        console.log(response)
        this.ngZone.run(() => {
          this.showPlot = true;
        });
        this.cdr.detectChanges();
        // this.router.navigate(['/results'], { state: { results: response } });
        this.displayProbabilities(response["probabilities"])
        this.summary_data = response['summary_data']
        this.force_data = response['force_data']
        this.summary_base64 = response['summary_base64']
        this.force_base64 = response['force_base64']
        // this.summaryPlotHtml = this.sanitizer.bypassSecurityTrustHtml(response['summary_plot']);
        // this.forcePlotHtml = this.sanitizer.bypassSecurityTrustHtml(response['force_plot']);
        this.apiService.setLoading(false);
      }, error => {
        console.error('Error:', error);
        this.ngZone.run(() => {
          this.showPlot = false;
        });
        this.cdr.detectChanges();
        this.apiService.setLoading(false);
      });

    }
  }

  explainModel() {
    if (this.dialog.openDialogs.length > 0) {
      return;
    }
    const dialogConfig = new MatDialogConfig();
    const dialogRef = this.dialog.open(PlotModalComponent, {
      width: '80%',
      height: '80%',
      maxWidth: '80vw',
      maxHeight: '80vh',
      data: {
        summary_data: this.summary_data,
        force_data: this.force_data,
        summary_base64: this.summary_base64,
        force_base64: this.force_base64
      },
      autoFocus: true,
      disableClose: false,
      panelClass: 'custom-dialog-wrapper'
    });

    dialogRef.afterClosed().subscribe(result => {
      window.focus();
    });
  }

  displayProbabilities(probabilities: number[]) {
    const data = [
      {
        type: 'bar',
        x: probabilities,
        y: ['Poor', 'Standard', 'Good'],
        orientation: 'h',
        marker: {
          color: ['red', 'orange', 'green'],
        },
      },
    ] as any[];

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

    this.plotElement = document.getElementById('plot-container');

    if (this.plotElement['data'] && this.plotElement.data.length) {
      Plotly.restyle(this.plotElement, { 'x': probabilities });
    } else {
      Plotly.newPlot('plot-container', data, layout, config);
    }
  }

}