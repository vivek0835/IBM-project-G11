import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalReviews: number = 144;
  positivePercentage: number = 75;
  negativePercentage: number = 25;

  reviews = [
    { name: 'Sunil Cooper', stars: '★★★★★', title: 'Amazing Product', comment: 'This is hands down the best purchase I have made this year.' },
    { name: 'Raghav Roy', stars: '★★★★★', title: 'Amazing Product', comment: 'The product exceeded expectations in every way.' },
    { name: 'Mukesh Ambani', stars: '★☆☆☆☆', title: 'Bad Product', comment: 'The product does not perform as advertised.' }
  ];

  constructor() {}

  ngOnInit(): void {}
}
