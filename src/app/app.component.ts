import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Assesment';
  constructor(private _router: Router) {

  }
  ngOnInit() {
    const month=new Date().getMonth()+1;
    console.log(month);
    this._router.navigate([`month/${month}`]);
  }
}
