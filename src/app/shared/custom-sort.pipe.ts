import { Pipe, PipeTransform } from '@angular/core';
import { AppoinmentModel } from '../Utils/appoinmentModel';
import * as moment from 'moment';
@Pipe({
  name: 'customSort',
})
export class CustomSortPipe implements PipeTransform {
  transform(appoinmentArray: AppoinmentModel[]): AppoinmentModel[] {
    const newSoretdAppoinments = [
      ...appoinmentArray.sort((a, b) => {
        const dateTimeA = moment(
          new Date(
            moment(a.date, 'MM-DD-YYYY').toDate().toDateString() + ' ' + a.time
          )
        );
        const dateTimeB = moment(
          new Date(
            moment(b.date, 'MM-DD-YYYY').toDate().toDateString() + ' ' + b.time
          )
        );

        const valueOfA = moment(dateTimeA).valueOf();
        const valueOfB = moment(dateTimeB).valueOf();
        return valueOfA - valueOfB;
      }),
    ];

    return newSoretdAppoinments;
  }
}
