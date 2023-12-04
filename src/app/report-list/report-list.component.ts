import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Report } from '../shared/report';
import { ReportService } from '../report.service';
import { SortReportsService } from '../sort-reports.service';
import { Subscription } from 'rxjs';
import { RefreshMapService } from '../refresh-map.service';
import { MD5 } from 'crypto-js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.css']
})
export class ReportListComponent implements OnInit {
  @Output() coordinates = new EventEmitter<Report>();
  @Output() moreInfoEvent = new EventEmitter<Report>();
  @Output() editReportEvent = new EventEmitter<Report>();
  @ViewChild('table')
  table!: ElementRef;
  reports: Report[] = [];
  locationSortCounter: number = 0;
  suspectSortCounter: number = 0;
  timeSortCounter: number = 0;
  statusSortCounter: number = 0;
  private subscription: Subscription | undefined;

  constructor(private reportService: ReportService, private sortReportsService: SortReportsService, private refreshMapService: RefreshMapService,  private router: Router) { }

  ngOnInit(): void {
    this.loadReports();
    this.subscription = this.sortReportsService.reportUpdated$.subscribe(report => {
      this.loadReports();
    });
  }

  ngAfterViewInit() {
    this.subscription = this.sortReportsService.reportUpdated$.subscribe(() => {
      this.table.nativeElement.scrollIntoView({ behavior: 'smooth' });
      this.table.nativeElement.classList.add('glow');
      setTimeout(() => this.table.nativeElement.classList.remove('glow'), 1000);
    });
  }

  ngOnDestroy(): void {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }
  
  loadReports(): void {
    this.reportService.pull().then(reports => {
      console.log('Reports from server:', reports);
      this.reports = reports;
      this.reports = this.sortReportsService.sortReports(this.reports);
      for(let report of this.reports){
        this.coordinates.emit(report);
      }
    }).catch(error => {
      console.error('Error loading reports:', error);
    });
  }

  onReportDelete(report: Report): void {
    let queryString = prompt("Please enter your password to delete this report");
    if(queryString == null){
      return;
    } 
    let hashedQuery = MD5(queryString).toString();
    if(hashedQuery === "fcab0453879a2b2281bc5073e3f5fe54"){
      this.reportService.delete(report).then(() => {
        this.refreshMapService.refreshMap(this.reports);
        for(let report of this.reports){
          this.coordinates.emit(report);
        }
        this.loadReports(); 
      }).catch(error => {
        console.error('Error deleting report:', error);
      });
    }
    else{
      alert("Incorrect password");
    }
  }
    

  moreInfo(report: Report): void {
    this.moreInfoEvent.emit(report);
  }

  editReport(report: Report): void {
    let queryString = prompt("Please enter your password to edit this report");
    if(queryString == null){
      return;
    } 
    let hashedQuery = MD5(queryString).toString();
    if(hashedQuery === "fcab0453879a2b2281bc5073e3f5fe54"){
      this.editReportEvent.emit(report);
    }
    else{
      alert("Incorrect password");
    }
  }

  jumpToMapTrigger(report: Report): void {
    console.log(report);
  }

  sortByLocation(): void {
    this.suspectSortCounter = 0;
    this.timeSortCounter = 0;
    this.statusSortCounter = 0;
    this.locationSortCounter = (this.locationSortCounter + 1) % 2;
    if(this.locationSortCounter == 0){
      //Sort by location alphabetically
      this.reports.sort((a, b) => (a.locationName > b.locationName) ? 1 : -1);
    }
    else if(this.locationSortCounter == 1){
      //Sort by location reverse alphabetically
      this.reports.sort((a, b) => (a.locationName < b.locationName) ? 1 : -1);
    }
    else{
      return;
    }
  }

  sortBySuspect(): void {
    this.locationSortCounter = 0;
    this.timeSortCounter = 0;
    this.statusSortCounter = 0;
    this.suspectSortCounter = (this.suspectSortCounter + 1) % 2;
    if(this.suspectSortCounter == 0){
      //Sort by suspect alphabetically
      this.reports.sort((a, b) => (a.suspectName > b.suspectName) ? 1 : -1);
    }
    else if(this.suspectSortCounter == 1){
      //Sort by suspect reverse alphabetically
      this.reports.sort((a, b) => (a.suspectName < b.suspectName) ? 1 : -1);
    }
    else{
      return;
    }
  }

  sortByTime(): void {
    this.locationSortCounter = 0;
    this.suspectSortCounter = 0;
    this.statusSortCounter = 0;
    this.timeSortCounter = (this.timeSortCounter + 1) % 2;
    if(this.timeSortCounter == 0){
      //Sort by time latest to oldest
      this.reports.sort((a, b) => (a.timeReported > b.timeReported) ? 1 : -1);
    }
    else if(this.timeSortCounter == 1){
      //Sort by time oldest to latest
      this.reports.sort((a, b) => (a.timeReported < b.timeReported) ? 1 : -1);
    }
    else{
      return;
    }
  }

  sortByStatus(): void {
    this.locationSortCounter = 0;
    this.suspectSortCounter = 0;
    this.timeSortCounter = 0;
    this.statusSortCounter = (this.statusSortCounter + 1) % 2;
    if(this.statusSortCounter == 0){
      //Sort by status resolved to unresolved
      this.reports.sort((a, b) => {
        if(a.resolved && !b.resolved) {
          return -1;
        }
        if(b.resolved && !a.resolved) {
          return 1;
        }
        return 0;
      });
    }
    else if(this.statusSortCounter == 1){
      //Sort by status unresolved to resolved
      this.reports.sort((a, b) => {
        if(a.resolved && !b.resolved) {
          return 1;
        }
        if(b.resolved && !a.resolved) {
          return -1;
        }
        return 0;
      });
    }
    else{
      return;
    }
  }
  addReport(): void {
    this.router.navigate(['/report']);
  }
}