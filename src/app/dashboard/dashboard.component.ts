import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Review } from '../models/review.model';
import { LinebreakPipe } from '../linebreak.pipe';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgxEchartsModule, LinebreakPipe, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalReviews = 0;
  positivePercentage = 0;
  negativePercentage = 0;
  neutralPercentage = 0;
  reviews: Review[] = [];
  productName: string = 'Loading...';
  averageRating: number = 0;
  positiveReviews: Review[] = [];
  negativeReviews: Review[] = [];
  neutralReviews: Review[] = [];
  positiveChartOptions: any = {};
  negativeChartOptions: any = {};
  neutralChartOptions: any = {};

  // Word Cloud data for custom display
  wordCloudData: { text: string; size: number; color: string }[] = [];

  constructor(private apiService: ApiService, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.apiService.getStats().subscribe((res: any) => {
      const pos = res.sentiment_distribution?.positive || 0;
      const neu = res.sentiment_distribution?.neutral || 0;
      const neg = res.sentiment_distribution?.negative || 0;
      const total = pos + neu + neg;

      this.totalReviews = total;
      this.positivePercentage = total ? Math.round((pos / total) * 100) : 0;
      this.negativePercentage = total ? Math.round((neg / total) * 100) : 0;
      this.neutralPercentage = total ? Math.round((neu / total) * 100) : 0;
      this.averageRating = +res.average_rating.toFixed(1);

      this.setChartOptions();
    });

    this.apiService.getReviews().subscribe((reviews: Review[]) => {
      this.reviews = reviews;
      this.positiveReviews = reviews.filter(r => r.sentiment_label.toLowerCase() === 'positive');
      this.negativeReviews = reviews.filter(r => r.sentiment_label.toLowerCase() === 'negative');
      this.neutralReviews = reviews.filter(r => r.sentiment_label.toLowerCase() === 'neutral');

      if (reviews.length > 0) {
        this.productName = reviews[0].product_name;
      }

      this.generateWordCloud(); // generate word cloud after reviews are loaded
    });
  }

  setChartOptions(): void {
    this.positiveChartOptions = this.createGaugeChart(this.positivePercentage, '#228B22');
    this.negativeChartOptions = this.createGaugeChart(this.negativePercentage, '#CC5500');
    this.neutralChartOptions = this.createGaugeChart(this.neutralPercentage, '#ADD8E6');
  }

  createGaugeChart(percentage: number, color: string): any {
    return {
      series: [
        {
          type: 'gauge',
          startAngle: 90,
          endAngle: -270,
          radius: '100%',
          pointer: { show: false },
          progress: {
            show: true,
            overlap: false,
            roundCap: true,
            clip: false,
            itemStyle: { color: color }
          },
          axisLine: {
            lineStyle: {
              width: 20,
              color: [
                [percentage / 100, color],
                [1, '#F0F0F0']
              ]
            }
          },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          detail: {
            valueAnimation: true,
            formatter: '{value}%',
            color: '#000000',
            fontSize: 35,
            fontWeight: 'bold',
            fontFamily: 'Roboto Slab, serif',
            offsetCenter: [0, '0%']
          },
          data: [{ value: percentage }]
        }
      ]
    };
  }

  generateWordCloud(): void {
    const wordCounts: { [word: string]: number } = {};
  
    this.reviews.forEach(review => {
      const words = review.review_text.toLowerCase().match(/\b\w{4,}\b/g);
      if (words) {
        words.forEach(word => {
          wordCounts[word] = (wordCounts[word] || 0) + 1;
        });
      }
    });
  
    this.wordCloudData = Object.entries(wordCounts)
      .map(([text, count]) => ({
        text,
        size: 10 + count * 0.05,  // smaller base and multiplier
        color: this.getRandomColor()
      }))
      .sort((a, b) => b.size - a.size)
      .slice(0, 50);
  }  

  getRandomColor(): string {
    const colors = ['#ff6b81', '#1e90ff', '#ffa502', '#2ed573', '#a55eea', '#ff4757'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  logout(): void {
    this.authService.logout();
  }
}
