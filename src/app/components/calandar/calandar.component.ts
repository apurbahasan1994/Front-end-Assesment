import { Component, OnInit, Input } from '@angular/core';
import { AppoinmentService } from 'src/app/appoinment.service';
import { CalendarDay } from 'src/app/Utils/calanderDay';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AppointmentModalComponent } from 'src/app/shared/appointment-modal/appointment-modal.component';
import { AppoinmentModel } from 'src/app/Utils/appoinmentModel';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-calandar',
  templateUrl: './calandar.component.html',
  styleUrls: ['./calandar.component.scss'],
})
export class CalandarComponent implements OnInit {
  public calendar: CalendarDay[] = [];
  @Input() public monthNames: string[] = [];
  public displayMonth: string = '';
  private monthIndex: number = new Date().getMonth();
  @Input() public monthValue: number = new Date().getMonth();
  constructor(
    private _apponmentService: AppoinmentService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.generateCalendarDays(this.monthIndex);
    this._apponmentService
      .getAppoinment()
      .subscribe(({ appoinment, method, index }) => {
        //get the Calander day object that has the same date value of incoming appoinment
        const filteredDates = this.calendar.filter(
          (day) =>
            day.date.setHours(0, 0, 0, 0) ===
            appoinment.date.setHours(0, 0, 0, 0)
        );
        //checks if the incoming request is for update or not
        if (method === 'update') {
          //check if the index is bigger than -1 or not . I have set -1 as the initial subject value
          if (index! >= 0) {
            //find the CalendarDay object with the given index
            const day: CalendarDay = this.calendar[index!];
            //now find the index location of the current appointment whose value we want to update
            const appoinmentLocation = day.appointMents.findIndex(
              (app) => app.id === appoinment.id
            );
            //check if the location is greater than -1 or not. bcz findIndex returns -1 if it does not find the specified objedct.
            if (appoinmentLocation > -1) {
              //now filter out the current appointment object which we want to update
              day.appointMents = day.appointMents.filter(
                (x) => x.id !== appoinment.id
              );
              //create a new CalanderDay object with the specific date.
              const newDay = new CalendarDay(day.date);
              //assign the filter out assignments to the New CalendarDay object
              newDay.appointMents = [...day.appointMents];
              // now update the value stored in the index which CalanderDay value we are trying to update.
              this.calendar[index!] = newDay;
            }
          }
        }

        //now below work will happen regardless of its for update or create

        // checking if we have found any date based on incoming appointment has. It can be skipped
        if (filteredDates.length > 0) {
          let day: Date = new Date(new Date().setMonth(this.monthIndex));
          // can do filterDates[0] bcz filtered date will be one in this case
          filteredDates.forEach((date) => {
            //for create we dont know the index where we are tring to add the appoinment
            //so we try to find the index so that we can add the new incoming appointment
            const idx = this.calendar.findIndex((d) => d === date);
            if (idx > -1) {
              //creating a new day
              const newDay = new CalendarDay(appoinment.date);
              //copying all the current appointments value to newly created day
              newDay.appointMents = [...this.calendar[idx].appointMents];
              //push the new appointment to the list
              newDay.appointMents.push(appoinment);
              //change object stored in the state calander list index
              this.calendar[idx] = newDay;
              //now doing this for rebuilding the  component. dont know there is a need of doing this or not.
              this.calendar = [...this.calendar];

              //gettinf the month value off the appoinment
              const month = this.monthNames[appoinment.date.getMonth()];
              //checking if in localstorage we have value stored with the month name
              this.setAndResetLocalStorage(month, this.calendar);
              this.openSnackBar('Successfull', 'Ok');
            }
          });
        } else {
          //if user selects date beyond current month
          this.addToLocalStorage(appoinment.date.getMonth(), appoinment);
        }
      });
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4000,
      panelClass: ['snackBar'],
    });
  }
  ngOnChanges(monthIndex: number) {
    if (this.monthIndex !== this.monthValue) {
      this.monthIndex = this.monthValue;
      this.generateCalendarDays(this.monthIndex);
    }
  }

  addToLocalStorage(monthIndex: number, appoinment: AppoinmentModel) {
    let day: Date = new Date(new Date().setMonth(monthIndex));
    const month = this.monthNames[day.getMonth()];
    const persistedDates = localStorage.getItem(month);
    let startingDateOfCalendar = new Date(day.setDate(1));
    let dateToAdd = startingDateOfCalendar;
    let calendar: CalendarDay[] = this.createDays(dateToAdd);
    const filteredDates = calendar.filter(
      (day) =>
        day.date.setHours(0, 0, 0, 0) === appoinment.date.setHours(0, 0, 0, 0)
    );
    if (filteredDates.length > 0) {
      let day: Date = new Date(new Date().setMonth(this.monthIndex));
      filteredDates.forEach((date) => {
        const idx = calendar.findIndex((d) => d === date);
        if (idx > -1) {
          const isForUpdate = calendar[idx].appointMents.findIndex(
            (app) => app.id === appoinment.id
          );
          if (isForUpdate > -1) {
            calendar[idx].appointMents[isForUpdate] = appoinment;
            const newDay = new CalendarDay(this.calendar[idx].date);
            newDay.appointMents = [...calendar[idx].appointMents];
            calendar[idx] = newDay;
            const month = this.monthNames[appoinment.date.getMonth()];
            this.setAndResetLocalStorage(month, calendar);
            return;
          }
          const newDay = new CalendarDay(calendar[idx].date);
          newDay.appointMents = [...calendar[idx].appointMents];
          newDay.appointMents.push(appoinment);
          calendar[idx] = newDay;
          const month = this.monthNames[appoinment.date.getMonth()];
          this.setAndResetLocalStorage(month, calendar);
          this.openSnackBar('Successfull', 'Ok');
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
    if (this.checkingPersitanceStorageWithMonthKey(this.displayMonth)) {
      return;
    }
    let startingDateOfCalendar = new Date(day.setDate(1));
    let dateToAdd = startingDateOfCalendar;
    this.calendar = this.createDays(dateToAdd);
    localStorage.setItem(this.displayMonth, JSON.stringify(this.calendar));
  }
  setAndResetLocalStorage(month: string, calendar: CalendarDay[]) {
    const persistedDates = localStorage.getItem(month);
    if (persistedDates) {
      localStorage.removeItem(month);
      localStorage.setItem(month, JSON.stringify(calendar));
    } else {
      localStorage.setItem(month, JSON.stringify(calendar));
    }
  }
  checkingPersitanceStorageWithMonthKey(displayMonth: string): boolean {
    const persistedDates = localStorage.getItem(displayMonth);
    if (persistedDates) {
      this.calendar = JSON.parse(persistedDates);
      this.calendar = this.calendar.map((date) => {
        return { ...date, date: new Date(date.date) } as CalendarDay;
      });
      return true;
    }
    return false;
  }

  createDays(dateToAdd: Date): CalendarDay[] {
    let calandar: CalendarDay[] = [];
    for (let i = 0; i < 35; i++) {
      calandar.push(new CalendarDay(new Date(dateToAdd)));
      dateToAdd = new Date(dateToAdd.setDate(dateToAdd.getDate() + 1));
    }
    return calandar;
  }

  openAppoinmentModal(appoinment: AppoinmentModel, index: number) {
    this.dialog.open(AppointmentModalComponent, {
      width: '500px',
      data: { appoinment, fromEdit: true, index },
    });
  }
}
