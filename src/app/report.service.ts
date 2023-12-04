import { Injectable } from '@angular/core';
import { Report } from './shared/report';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { nanoid } from 'nanoid';


@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private baseUrl = 'https://272.selfip.net/apps/';
  private appKey = 'slI61v2RVM';
  private collectionKey = 'reports';

  constructor(private http: HttpClient) { }
  async pull(): Promise<Report[]> {
    const url = `${this.baseUrl}${this.appKey}/collections/${this.collectionKey}/documents/`;
    let fetchedReports:Promise<{key:string, data:string}[]> = firstValueFrom(this.http.get<{key:string, data:string}[]>(url));
    
    return fetchedReports.then(reports => {
      let parsedReports: Report[] = [];
      for(let i = 0; i < reports.length; i++) {
        parsedReports.push(JSON.parse(reports[i].data));
      }
      return parsedReports;
    });
  }

  async push(newReport: Report): Promise<any> {
    const url = `${this.baseUrl}${this.appKey}/collections/${this.collectionKey}/documents/`;
    console.log('Sending report to server:', newReport);
    const headers = { 'Content-Type': 'application/json' };
    let newReportJSON: string = JSON.stringify(newReport);
    let key = newReport.id.toString();
    const body = { key: key, data: newReportJSON };
    return firstValueFrom(this.http.post(url, body, { headers }));
  }

  async delete(reportToDelete: Report): Promise<any> {
    const url = `${this.baseUrl}${this.appKey}/collections/${this.collectionKey}/documents/${reportToDelete.id}`;
    return firstValueFrom(this.http.delete(url));
  }

  generateId(): string {
    return nanoid();
  }
}
