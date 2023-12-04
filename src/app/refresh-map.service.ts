import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Report } from './shared/report';

@Injectable({
  providedIn: 'root'
})
export class RefreshMapService {
  refreshMap$ = new Subject<void>();

  constructor() { }

  refreshMap(reportList: Report[]) {
    this.refreshMap$.next();
  }
}