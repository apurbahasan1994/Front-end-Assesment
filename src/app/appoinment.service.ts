import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppoinmentModel } from './Utils/appoinmentModel';
export interface SubjectModel {
  appoinment: AppoinmentModel;
  method?: string;
  index?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AppoinmentService {
  subjectObject: SubjectModel = {
    appoinment: {
      firstName: '',
      lastName: '',
      email: '',
      date: new Date('1/1/1000'),
      time: new Date('1/1/1000').toString(),
      age: 0,
      gender: '',
    },
  };
  selectedMonth: Date = new Date();
  newSelectedMonth: BehaviorSubject<Date> = new BehaviorSubject<Date>(
    this.selectedMonth
  );
  newsubjectObject: BehaviorSubject<SubjectModel> =
    new BehaviorSubject<SubjectModel>(this.subjectObject);
  constructor() {}
  getAppoinment() {
    return this.newsubjectObject.asObservable();
  }
  setAppoinment(subjectObject: SubjectModel) {
    this.newsubjectObject.next({
      ...subjectObject,
      appoinment: { ...subjectObject.appoinment },
    });
  }
  getSelectedMonth() {
    return this.newSelectedMonth.asObservable();
  }
  setSelectedMonth(date: Date) {
    this.newSelectedMonth.next(date);
  }
}
