import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { AppoinmentService } from 'src/app/appoinment.service';
import { AppoinmentModel } from 'src/app/Utils/appoinmentModel';
import { ID } from 'src/app/Utils/utils';
const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-appointment-modal',
  templateUrl: './appointment-modal.component.html',
  styleUrls: ['./appointment-modal.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AppointmentModalComponent implements OnInit {
  selectedValue: string = '';
  selectedCar: string = '';
  date = new FormControl(moment());
  genders: string[] = [
    "Male", "Female", "Others"
  ];
  hasNumberError: boolean = false;
  genderValue = { value: 'male', viewValue: 'Male' };
  today: Date = new Date();
  maxDate?: Date;
  appoinmentForm: FormGroup = new FormGroup({});
  constructor(
    public dialogRef: MatDialogRef<AppointmentModalComponent>,
    private _apponmentService: AppoinmentService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit(): void {
    this.maxDate = new Date(this.today.getFullYear(), this.today.getMonth() + 1, 0);
    this.appoinmentForm = this.createFrom();
    this._apponmentService.getSelectedMonth().subscribe(date => {
      if (!this.data?.appoinment) {
        this.control.dateFormControl.setValue(date);
        this.control.dateFormControl.updateValueAndValidity();
      }
    });

  }


  createFrom(): FormGroup {
    return new FormGroup({
      emailFormControl: new FormControl(this.data?.appoinment?.email ?? '', [
        Validators.required,
        Validators.email,
      ]),
      firstNameFormControl: new FormControl(
        this.data?.appoinment?.firstName ?? '',
        [Validators.required, Validators.maxLength(40)]
      ),
      lastNameFormControl: new FormControl(
        this.data?.appoinment?.lastName ?? '',
        [Validators.required, Validators.maxLength(40)]
      ),
      genderFormControl: new FormControl(this.data?.appoinment?.gender ?? this.genders[0]),
      ageFormControl: new FormControl(this.data?.appoinment?.age ?? 0, [
        Validators.min(0),
        Validators.pattern(/^-?(0|[1-9]\d*)?$/)
      ]),
      dateFormControl: new FormControl(
        this.data?.appoinment?.date ? new Date(this.data?.appoinment?.date) : new Date()
      ),
      timeFormControl: new FormControl(this.data?.appoinment?.time ?? null, [
        Validators.required,
      ]),
    });
  }
  onSubmitForm() {
    if (!(/^-?([1-9]\d*)?$/.test(this.appoinmentForm.value.ageFormControl))) {
      this.control.ageFormControl.setErrors('pattern', true);
      this.hasNumberError = true;
      return;
    }
    if (this.appoinmentForm.valid) {
      const newAppoinment: AppoinmentModel = {
        id: !this.data ? ID() : this.data?.appoinment?.id,
        firstName: this.control.firstNameFormControl.value,
        lastName: this.control.lastNameFormControl.value,
        email: this.control.emailFormControl.value,
        age: +this.control.ageFormControl.value,
        gender: this.control.genderFormControl.value,
        date: this.control.dateFormControl.value instanceof Date ? this.control.dateFormControl.value : new Date(this.control.dateFormControl.value),
        time: this.control.timeFormControl.value,
      };
      this._apponmentService.setAppoinment({ appoinment: newAppoinment, method: this.data?.appoinment ? 'update' : "add", index: this.data?.appoinment ? this.data?.index : -1 });
      this.dialogRef.close();
    }
    else {
      this.appoinmentForm.markAllAsTouched();
    }

  }
  get control(): any {
    return this.appoinmentForm.controls;
  }
}
export interface DialogData {
  appoinment?: AppoinmentModel;
  fromEdit?: boolean;
  index?: number
}
