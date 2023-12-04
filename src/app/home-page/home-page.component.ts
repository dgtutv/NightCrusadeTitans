import { Component, OnInit } from '@angular/core';
import { Report } from '../shared/report';
import { ReportService } from '../report.service';
import { SortReportsService } from '../sort-reports.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  currentReport: Report | undefined;
  currentReportEdit: Report | undefined;
  resolved: boolean = false;

  constructor(private reportService: ReportService, private sortReportsService: SortReportsService) { }

  ngOnInit(): void {
  }

  moreInfo(report: Report): void {
    this.currentReport = report;
    console.log(this.currentReport);
    let blur = document.getElementById("blur");
    if(blur){
      blur.classList.toggle("active");
    }
  }

  closeOverlay(): void {
    this.currentReport = undefined;
    let blur = document.getElementById("blur");
    if(blur){
      blur.classList.toggle("active");
    }
  }

  editReport(report: Report): void {
    this.currentReportEdit = report;
    let blur = document.getElementById("blur");
    if(blur){
      blur.classList.toggle("active");
    }
    this.resolved = report.resolved;
  }

  async onSubmit(): Promise<void> {
    let statusElement: HTMLSelectElement | null = document.getElementById("status") as HTMLSelectElement | null;
    if (statusElement) {
      let statusValue = statusElement.value;
      let resolved: boolean;
      if(statusValue === "true"){
        resolved = true;
      }
      else{
        resolved = false;
      }
      //Create a new report in main memory with all the same stats
      if (this.currentReportEdit) {
        let newReport = new Report(
          this.currentReportEdit.reporterName,
          this.currentReportEdit.phoneNumber,
          this.currentReportEdit.suspectName,
          this.currentReportEdit.locationName,
          this.currentReportEdit.longitude,
          this.currentReportEdit.latitude,
          this.currentReportEdit.picture || '',
          this.currentReportEdit.extraInfo,
          this.currentReportEdit.id,
          this.currentReportEdit.timeReported,
          resolved
        );
        console.log(newReport);
        //Delete the old report from the server
        await this.reportService.delete(this.currentReportEdit);
        //Add the new report to the server
        await this.reportService.push(newReport);
        this.sortReportsService.updateSortByReport(this.currentReportEdit);
        //Close the overlay
        this.currentReportEdit = undefined;
        let blur = document.getElementById("blur");
        if(blur){
          blur.classList.toggle("active");
        }
      }
    } 
  }
}
