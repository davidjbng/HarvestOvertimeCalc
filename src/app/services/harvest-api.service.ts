import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { flatMap, map, finalize } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { TimeEntry } from '@app/models/timeEntry.model';
import { resolveComponentResources } from '@angular/core/src/metadata/resource_loading';
import { TimeEntryResponse } from '@app/models/timeEntryResponse.model';
import { HarvestProfile } from '@app/models/harvestProfile.model';

@Injectable({
  providedIn: 'root'
})
export class HarvestApiService {

  constructor(private http: HttpClient) { }

  public getProfile(): Observable<HarvestProfile> {
    return this.http.get<HarvestProfile>(`${environment.harvestApi}/users/me.json`);
  }

  public getTimesheets(from: Date, to: Date, progressSubject?: Subject<number>): Observable<TimeEntry[]> {
    if(progressSubject){
      progressSubject.next(0);
    }

    const entries = new Array<TimeEntry>();

    const getNextPack = (url: string | null): Observable<any> => {
      return url == null ? of(true) : this.http.get<TimeEntryResponse>(url).pipe(
        flatMap(res => {
          if(progressSubject){
            progressSubject.next(Math.floor(res.page / res.total_pages * 100));
          }
          entries.push(...res.time_entries);
          return getNextPack(res.links.next);
        })
      )
    }

    return this.getInitialTimesheetsFromApi(from.toISOString().split('T')[0], to.toISOString().split('T')[0], 1).pipe(
      flatMap(response => {
        entries.push(...response.time_entries);
        return getNextPack(response.links.next)
      }),
      map(() => entries)
    )
  }

  private getInitialTimesheetsFromApi(from: string, to: string, page: number): Observable<TimeEntryResponse> {
    return this.http.get<TimeEntryResponse>(`${environment.harvestApi}/time_entries`, {
      params: new HttpParams({
        fromObject: {
          from: from,
          to: to
        }
      })
    });
  }

}
