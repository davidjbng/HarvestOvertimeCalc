import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { HarvestApiService } from '@app/services/harvest-api.service';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'app-overtime-calc',
  templateUrl: './overtime-calc.component.html',
  styleUrls: ['./overtime-calc.component.scss']
})
export class OvertimeCalcComponent implements OnInit, AfterViewInit {

  @ViewChild('form')
  public form: NgForm;
  public overtime: string;
  public progressSubject = new Subject<number>();
  public showSpinner: boolean = false;

  constructor(public auth: AuthService, private harvestApi: HarvestApiService, private router: Router) { }

  public ngOnInit() {
    if(!this.auth.profile) {
      this.router.navigate([`/login`]);
    }
  }

  public ngAfterViewInit(): void {
    setTimeout(() =>
    this.form.setValue({
      to: new Date().toISOString().split("T")[0],
      from: new Date(this.auth.profile.created_at).toISOString().split("T")[0],
      hoursPerWeek: 40
    })
  )
  }

  public getOvertime(form: NgForm): void {
    this.showSpinner = true;

    const from = new Date(form.value.from);
    const to = new Date(form.value.to);

    this.harvestApi.getTimesheets(from, to, this.progressSubject).pipe(
      finalize(() => this.showSpinner = false)
    ).subscribe(sheets => {
      const neededHoursperDay = form.value.hoursPerWeek / 5;
      const totalWorkingTime = sheets.reduce((acc, sheet) => acc + sheet.hours, 0);
      const amountOfWorkingDays = this.getAmountOfWorkingDays(new Date(from), new Date(to));
      const neededHours = amountOfWorkingDays * neededHoursperDay;
      this.overtime = (totalWorkingTime - neededHours).toFixed(2);
    })
  }

  private getAmountOfWorkingDays(startDate: Date, endDate: Date) {
    var numWorkDays = 0;
    var currentDate = startDate;
    while (currentDate <= endDate) {
      // Skips Sunday and Saturday
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        numWorkDays++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return numWorkDays;
  }

}
