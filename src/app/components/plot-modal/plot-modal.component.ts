import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SafeHtml } from '@angular/platform-browser';
import * as Plotly from 'plotly.js';

export interface DialogData {
  summary_data: any;
  force_data: any;
}

@Component({
  selector: 'app-plot-modal',
  templateUrl: './plot-modal.component.html',
  styleUrls: ['./plot-modal.component.css']
})
export class PlotModalComponent {
  summary:any;
  force:any;

  constructor(
    public dialogRef: MatDialogRef<PlotModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {

    this.createSummaryPlot(data);
    this.createForcePlot(data);
  }

  createSummaryPlot(summary_dat: any): void {
    this.summary = summary_dat['summary_data']
    const trace: any = {
      type: 'bar',
      x: this.summary.shap_values,
      y: this.summary.feature_names,
      orientation: 'h',
    };
  
    const layout = {
      title: 'SHAP Summary Plot',
      xaxis: {
        title: 'SHAP Value',
      },
      yaxis: {
        title: 'Feature',
      },
    };
  
    const config = {
      responsive: true,
    };
  
    Plotly.newPlot('summary-plot-container', [trace], layout, config);
  }

  createForcePlot(force_dat: any): void {
    this.force = force_dat['force_data']
    const trace: any = {
      type: 'bar',
      x: this.force.shap_values,
      y: this.force.feature_names,
      orientation: 'h',
    };
  
    const layout = {
      title: 'SHAP Force Plot',
      xaxis: {
        title: 'SHAP Value',
      },
      yaxis: {
        title: 'Feature',
      },
    };
  
    const config = {
      responsive: true,
    };
  
    Plotly.newPlot('force-plot-container', [trace], layout, config);
  }
}
