import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Report } from '../shared/report';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent{
  @Input() report!:Report;
  @Output() reportDeleted = new EventEmitter<Report>();

  constructor() { }
}