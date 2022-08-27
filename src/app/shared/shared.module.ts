import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentModalComponent } from './appointment-modal/appointment-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { ChunkPipe } from './chunk.pipe';
import { CustomSortPipe } from './custom-sort.pipe';
@NgModule({
  declarations: [AppointmentModalComponent, ChunkPipe, CustomSortPipe],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatDividerModule,
    NgxMatTimepickerModule,
  ],
  exports: [ChunkPipe, CustomSortPipe],
})
export class SharedModule {}
