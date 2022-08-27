import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppoinmentService } from 'src/app/appoinment.service';
import { AppointmentModalComponent } from 'src/app/shared/appointment-modal/appointment-modal.component';
@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent implements OnInit {
  currentMonth: string = '';
  months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  monthIndex:number=new Date().getMonth();
  constructor(public dialog: MatDialog,private _router:Router,private _apponmentService: AppoinmentService) { }
  ngOnInit(): void {
    this.currentMonth = this.months[new Date().getMonth()]
  }
  onMonthChage(month: string,index:number) {
    this.currentMonth = month;
    this.monthIndex=index;
    this._router.navigate(['/month/'+ (+index+1)]);
    this._apponmentService.setSelectedMonth(new Date(new Date(new Date().setMonth(index)).setDate(1)));
  }
  openDialog(): void {
    this.dialog.open(AppointmentModalComponent, {
      width: '500px',
    });
  }

}
