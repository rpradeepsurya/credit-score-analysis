import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { InputFormComponent } from './components/input-form/input-form.component';
import { ResultsComponent } from './components/results/results.component';
import { AboutModelComponent } from './components/about-model/about-model.component';
import { FeedbackComponent } from './components/feedback/feedback.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'input-form', component: InputFormComponent },
  { path: 'results', component: ResultsComponent },
  { path: 'about-model', component: AboutModelComponent },
  { path: 'feedback', component: FeedbackComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
