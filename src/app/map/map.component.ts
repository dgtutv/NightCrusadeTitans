import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Report } from '../shared/report';
import { SortReportsService } from '../sort-reports.service';
import { RefreshMapService } from '../refresh-map.service';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  private map: L.Map | undefined;
  private markersLayer: L.LayerGroup = L.layerGroup();

  constructor(private sortReportService:SortReportsService, private refreshMapService: RefreshMapService, private reportService: ReportService) { }

  ngOnInit(): void {
    this.refreshMapService.refreshMap$.subscribe(() => {
      //get the reports from the server
      this.reportService.pull().then(reports => {
        this.refreshMap(reports);
      }).catch(error => {
        console.error('Error loading reports:', error);
      });
    });
    this.createMap();
  }

  createMap(){
    this.map = L.map('map').setView([49.205, -122.689897], 9.8);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(this.map);
    this.markersLayer.addTo(this.map);
  }

  async handleCoordinates(report: Report) {
    let numOfReportsAtLocation = 0;
    if (this.map) {
      let currentMarker = L.marker([report.latitude, report.longitude], { riseOnHover: true })
      .on('click', async () => {
        this.map!.flyTo([report.latitude, report.longitude], 15);
        this.sortReportService.updateSortByReport(report);
        let reports = await this.reportService.pull();
        for(let r of reports){
          if(r.locationName === report.locationName){
            numOfReportsAtLocation++;
          }
        }
        if(numOfReportsAtLocation === 1){
          currentMarker.bindPopup(`<b>${report.locationName}</b><br>${numOfReportsAtLocation} report`).openPopup();
        }
        else{
          currentMarker.bindPopup(`<b>${report.locationName}</b><br>${numOfReportsAtLocation} reports`).openPopup();
        }
      })
      .addTo(this.markersLayer);
    }
  }

  refreshMap(reportList: Report[]){
    this.markersLayer.clearLayers();
    reportList.forEach(report => {
      this.handleCoordinates(report);
    });
  }
}