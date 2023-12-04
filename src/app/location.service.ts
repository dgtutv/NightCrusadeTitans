import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { nanoid } from 'nanoid';
import { LocationCustom } from './locationCustom';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(private http: HttpClient) {}
  private locationSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  private baseUrl = 'https://272.selfip.net/apps/';
  private appKey = 'slI61v2RVM';
  private collectionKey = 'locations';

  getLocationUpdate(): Observable<string | null> {
    return this.locationSubject.asObservable();
  }

  updateLocation(): void {
    this.locationSubject.next(null);
  }

  async push(newLocation: LocationCustom): Promise<any> {
    let locationExists = false;
    let locations = await this.pull();
    for(let i = 0; i < locations.length; i++) {
      if(locations[i].name == newLocation.name) {
        locationExists = true;
        alert("Location with that name already exists!");
        return;
      }
    }

    const url = `${this.baseUrl}${this.appKey}/collections/${this.collectionKey}/documents/`;
    console.log('Sending report to server:', newLocation);
    const headers = { 'Content-Type': 'application/json' };
    let newLocationJSON: string = JSON.stringify(newLocation);
    let key = nanoid();
    const body = { key: key, data: newLocationJSON };
    return firstValueFrom(this.http.post(url, body, { headers }));
  }

  async pull(): Promise<LocationCustom[]> {
    const url = `${this.baseUrl}${this.appKey}/collections/${this.collectionKey}/documents/`;
    let fetchedLocations:Promise<{key:string, data:string}[]> = firstValueFrom(this.http.get<{key:string, data:string}[]>(url));
    
    return fetchedLocations.then(locations => {
      let parsedLocations: LocationCustom[] = [];
      for(let i = 0; i < locations.length; i++) {
        parsedLocations.push(JSON.parse(locations[i].data));
      }
      return parsedLocations;
    });
  }
}
