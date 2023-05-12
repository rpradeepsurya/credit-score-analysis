import { Component, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SafeHtml } from '@angular/platform-browser';
import * as Plotly from 'plotly.js';

export interface DialogData {
  summary_data: any;
  force_data: any;
  summary_base64: any;
  force_base64: any;
}

@Component({
  selector: 'app-plot-modal',
  templateUrl: './plot-modal.component.html',
  styleUrls: ['./plot-modal.component.css']
})
export class PlotModalComponent implements AfterViewInit {
  summary: any;
  force: any;
  shapValues: any;
  featureNames: any;
  classNames: any;

  constructor(
    public dialogRef: MatDialogRef<PlotModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngAfterViewInit(): void {
    // this.createSummaryPlot(this.data);
    // this.createForcePlot(this.data);
    // this.createShapSummaryPlot(this.data)
  }

  createShapSummaryPlot(input:any): void {
    this.shapValues = input['summary_data']['shap_values']
    this.featureNames = input['summary_data']['feature_names']
    this.classNames = input['summary_data']['class_names']
    const numFeatures = this.shapValues[0].length;
    const numClasses = this.shapValues.length;

    const meanAbsShapValues = this.shapValues.map((clsValues:any) =>
      clsValues.reduce((sums:any, values:any) => sums.map((sum:any, i:any) => sum + Math.abs(values[i])), new Array(numFeatures).fill(0))
    ).map((sums:any) => sums.map((sum:any) => sum / numFeatures));

    const data = [] as any;
    for (let i = 0; i < numClasses; i++) {
      data.push({
        type: 'bar',
        y: this.featureNames,
        x: meanAbsShapValues[i],
        orientation: 'h',
        marker: {
          color: `rgba(${i * 30}, 150, 200, 0.6)`,
          line: { color: 'rgba(0, 0, 0, 1.0)', width: 0.5 }
        },
        name: this.classNames[i],
        showlegend: false,
        hovertemplate: '%{y}: %{x:.2f}<extra></extra>'
      });
    }

    const layout = {
      height: numClasses * 250,
      width: 800,
      title: 'SHAP Summary Plot',
      yaxis: { title: 'Feature' },
      xaxis: { title: 'Mean Absolute SHAP Value' },
      hovermode: 'y',
      margin: { l: 100 },
      grid: { rows: numClasses, columns: 1, pattern: 'independent' }
    } as any;

    Plotly.newPlot('shap-summary-plot', data, layout);
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
