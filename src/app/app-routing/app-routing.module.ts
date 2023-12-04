import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from '../home-page/home-page.component';
import { ReportPageComponent } from '../report-page/report-page.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from '../app.component';

const appRoutes: Routes = [
  { path: 'home', component: HomePageComponent },
  { path: 'report', component: ReportPageComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' } 
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes),
    BrowserModule
  ],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppRoutingModule { }
