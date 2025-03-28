import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Review } from '../models/review.model';
import { LinebreakPipe } from '../linebreak.pipe';
import { RouterModule } from '@angular/router';
import { signOut } from 'firebase/auth';
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
    productName: string = 'Loading...';  // Store product name
    averageRating: number = 0;  // Store average rating
    positiveReviews: Review[] = [];
    negativeReviews: Review[] = [];
    neutralReviews: Review[] = [];
    positiveChartOptions: any = {};
    negativeChartOptions: any = {};
    neutralChartOptions: any = {};

    constructor(private apiService: ApiService, private router: Router, private authService: AuthService) { }

    ngOnInit(): void {
        this.fetchData();
    }

    fetchData(): void {
        // Fetch statistics
        this.apiService.getStats().subscribe((res: any) => {
            const pos = res.sentiment_distribution?.positive || 0;
            const neu = res.sentiment_distribution?.neutral || 0;
            const neg = res.sentiment_distribution?.negative || 0;
            const total = pos + neu + neg;

            this.totalReviews = total;
            this.positivePercentage = total ? Math.round((pos / total) * 100) : 0;
            this.negativePercentage = total ? Math.round((neg / total) * 100) : 0;
            this.neutralPercentage = total ? Math.round((neu / total) * 100) : 0;
            this.averageRating = res.average_rating.toFixed(1); // Store and format average rating

            this.setChartOptions();
        });

        // Fetch reviews
        this.apiService.getReviews().subscribe((reviews: Review[]) => {
            this.reviews = reviews;
            this.positiveReviews = reviews.filter(r => r.sentiment_label.toLowerCase() === 'positive');
            this.negativeReviews = reviews.filter(r => r.sentiment_label.toLowerCase() === 'negative');
            this.neutralReviews = reviews.filter(r => r.sentiment_label.toLowerCase() === 'neutral');

            // Get product name from the first review (if available)
            if (reviews.length > 0) {
                this.productName = reviews[0].product_name;
            }
        });
    }

    setChartOptions(): void {
        this.positiveChartOptions = this.createGaugeChart(this.positivePercentage, '#228B22'); // Teal
        this.negativeChartOptions = this.createGaugeChart(this.negativePercentage, '#CC5500'); // Muted Red Orange
        this.neutralChartOptions = this.createGaugeChart(this.neutralPercentage, '#ADD8E6');  // Grey Blue
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
                                [1, '#F0F0F0']  // Remaining part in gray
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

    logout(): void {
        this.authService.logout(); // ✅ Call logout from AuthService
      }
}
