import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  islandList = [
    {
      name: 'NAaaaame',
      date: '2020-01-01',
      fruit: '',
      price: 500,
      hemisphere: 'N',
      queueLength: 32,
      expectedWaitTime: 7 * 60,
      description: 'Hi everyone!'
    }
  ];

  ngOnInit(): void {
  }

}
