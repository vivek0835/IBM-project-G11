import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private BASE_URL = 'https://ibmg11projectroberta-247654374842.asia-south2.run.app';

  constructor(private http: HttpClient) {}

  // Upload CSV File
  uploadCSV(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.BASE_URL}/upload/csv`, formData);
  }

  // Get statistical summary
  getStats(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/reviews/stats`);
  }

  // Get all reviews
  getReviews(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/reviews`);
  }

  // Optional: For single text sentiment analysis (if needed)
  analyzeText(text: string): Observable<any> {
    return this.http.post(`${this.BASE_URL}/analyze/text`, { text });
  }
}
