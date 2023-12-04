import { Injectable } from '@angular/core';
import { Report } from './shared/report';
import { ReportService } from './report.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SortReportsService {
  private sortedReports: Report[] = [];
  private reportUpdatedSource = new Subject<Report>();
  reportUpdated$ = this.reportUpdatedSource.asObservable();
  sortByReport: Report | null = null;

  sortReports(reports: Report[]): Report[] {
    this.sortedReports = [];
    if (this.sortByReport) {
      for (let report of reports) {
        //Generate distance from point
        report.distance = Math.sqrt(Math.pow((this.sortByReport.longitude - report.longitude), 2) + Math.pow((this.sortByReport.latitude - report.latitude), 2));
      }
      //Sort by distance
      this.sortedReports = reports.sort((a, b) => (a.distance > b.distance) ? 1 : -1);
      return this.sortedReports;
    }
    return reports;
  }

  constructor(private reportService: ReportService) { }

  updateSortByReport(report: Report): void {
    this.sortByReport = report;
    this.reportUpdatedSource.next(report);
  }
}