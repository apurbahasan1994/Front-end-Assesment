import { Component, OnInit, Input } from '@angular/core';
import { AppoinmentService } from 'src/app/appoinment.service';
import { CalendarDay } from 'src/app/Utils/calander-day';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AppointmentModalComponent } from 'src/app/shared/appointment-modal/appointment-modal.component';
import { AppoinmentModel } from 'src/app/Utils/appoinmentModel';
@Component({
  selector: 'app-calandar',
  templateUrl: './calandar.component.html',
  styleUrls: ['./calandar.component.scss']
})
export class CalandarComponent implements OnInit {

  public calendar: CalendarDay[] = [];
  @Input() public monthNames: string[] = [];
  public displayMonth: string = '';
  private monthIndex: number = new Date().getMonth();
  @Input() public monthValue: number = new Date().getMonth();
  constructor(private _apponmentService: AppoinmentService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.generateCalendarDays(this.monthIndex);
    this._apponmentService.getAppoinment().subscribe(({ appoinment, method, index }) => {

      if (method === 'update') {
        const filteredDates = this.calendar.filter((day) => day.date.setHours(0, 0, 0, 0) === appoinment.date.setHours(0, 0, 0, 0));
        if (index) {
          const day: CalendarDay = this.calendar[index];
          const isForUpdate = day.appointMents.findIndex(app => app.id === appoinment.id);
          if (isForUpdate > -1) {
            day.appointMents=day.appointMents.filter(x=>x.id!==appoinment.id);
            const newDay = new CalendarDay(day.date);
            newDay.appointMents = [...day.appointMents];
            this.calendar[index] = newDay;
            filteredDates.forEach(date=>{});
          }
        }
      }
      const filteredDates = this.calendar.filter((day) => day.date.setHours(0, 0, 0, 0) === appoinment.date.setHours(0, 0, 0, 0));
      if (filteredDates.length > 0) {
        let day: Date = new Date(new Date().setMonth(this.monthIndex));
        filteredDates.forEach(date => {
          const idx = this.calendar.findIndex((d) => d === date);
          if (idx > -1) {
            const newDay = new CalendarDay(appoinment.date);
            newDay.appointMents = [...this.calendar[idx].appointMents];
            newDay.appointMents.push(appoinment);
            this.calendar[idx] = newDay;
            this.calendar = [...this.calendar];
            const month = this.monthNames[appoinment.date.getMonth()];
            const persistedDates = localStorage.getItem(month);
            if (persistedDates) {
              localStorage.removeItem(month);
              localStorage.setItem(month, JSON.stringify(this.calendar));
            }
            else {
              localStorage.setItem(month, JSON.stringify(this.calendar));
            }
          }

        });
      }
      else {

        //if user selects date beyond current month
        this.addToLocalStorage(appoinment.date.getMonth(), appoinment);
      }
    });
  }
  ngOnChanges(monthIndex: number) {
    if (this.monthIndex !== this.monthValue) {
      this.monthIndex = this.monthValue;
      this.generateCalendarDays(this.monthIndex);
    }
  }

  addToLocalStorage(monthIndex: number, appoinment: AppoinmentModel) {
    let calendar: CalendarDay[] = [];
    let day: Date = new Date(new Date().setMonth(monthIndex));
    const month = this.monthNames[day.getMonth()];
    const persistedDates = localStorage.getItem(month);
    let startingDateOfCalendar = new Date(day.setDate(1));
    let dateToAdd = startingDateOfCalendar;
    for (var i = 0; i < 35; i++) {
      calendar.push(new CalendarDay(new Date(dateToAdd)));
      dateToAdd = new Date(dateToAdd.setDate(dateToAdd.getDate() + 1));
    }
    const filteredDates = calendar.filter((day) => day.date.setHours(0, 0, 0, 0) === appoinment.date.setHours(0, 0, 0, 0));
    if (filteredDates.length > 0) {
      let day: Date = new Date(new Date().setMonth(this.monthIndex));
      filteredDates.forEach(date => {
        const idx = calendar.findIndex((d) => d === date);
        if (idx > -1) {
          const isForUpdate = calendar[idx].appointMents.findIndex(app => app.id === appoinment.id);
          console.log(isForUpdate);
          if (isForUpdate > -1) {
            calendar[idx].appointMents[isForUpdate] = appoinment;
            const newDay = new CalendarDay(this.calendar[idx].date);
            newDay.appointMents = [...calendar[idx].appointMents];
            calendar[idx] = newDay;
            const month = this.monthNames[appoinment.date.getMonth()];
            const persistedDates = localStorage.getItem(month);
            if (persistedDates) {
              localStorage.removeItem(month);
              localStorage.setItem(month, JSON.stringify(calendar));
            }
            else {
              localStorage.setItem(month, JSON.stringify(calendar));
            }
            return;
          }
          const newDay = new CalendarDay(calendar[idx].date);
          newDay.appointMents = [...calendar[idx].appointMents];
          newDay.appointMents.push(appoinment);
          calendar[idx] = newDay;
          const month = this.monthNames[appoinment.date.getMonth()];
          const persistedDates = localStorage.getItem(month);
          if (persistedDates) {
            localStorage.removeItem(month);
            localStorage.setItem(month, JSON.stringify(calendar));
          }
          else {
            localStorage.setItem(month, JSON.stringify(calendar));
          }
        }

      });
    }
  }

  private generateCalendarDays(monthIndex: number): void {
    // we reset our calendar
    this.calendar = [];

    // we set the date
    let day: Date = new Date(new Date().setMonth(monthIndex));

    // set the dispaly month for UI
    this.displayMonth = this.monthNames[day.getMonth()];
    const persistedDates = localStorage.getItem(this.displayMonth);
    console.log(persistedDates);
    if (persistedDates) {
      this.calendar = JSON.parse(persistedDates);
      this.calendar = this.calendar.map((date) => { return ({ ...date, date: new Date(date.date) } as CalendarDay) });
      // localStorage.removeItem(this.displayMonth);
      return;
    }

    let startingDateOfCalendar = new Date(day.setDate(1));

    let dateToAdd = startingDateOfCalendar;

    for (var i = 0; i < 35; i++) {
      this.calendar.push(new CalendarDay(new Date(dateToAdd)));
      dateToAdd = new Date(dateToAdd.setDate(dateToAdd.getDate() + 1));
    }
    localStorage.setItem(this.displayMonth, JSON.stringify(this.calendar));
  }

  openAppoinmentModal(appoinment: AppoinmentModel, index: number) {
    console.log(index);
    this.dialog.open(AppointmentModalComponent, {
      width: '500px',
      data: { appoinment, fromEdit: true, index }
    });
  }
}
