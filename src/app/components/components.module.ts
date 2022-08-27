import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalandarComponent } from './calandar/calandar.component';
import { AppointmentComponent } from './appointment/appointment.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import {MatIconModule} from '@angular/material/icon'
import {MatSnackBarModule} from '@angular/material/snack-bar'
@NgModule({
  declarations: [
    CalandarComponent,
    AppointmentComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatIconModule,
    MatSnackBarModule
  ]
})
export class ComponentsModule { }
