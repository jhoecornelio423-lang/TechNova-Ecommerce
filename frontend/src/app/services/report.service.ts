import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = '/api/reports/';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor(private http: HttpClient) { }

  getInventoryDistribution(): Observable<any[]> {
    return this.http.get<any[]>(API_URL + 'inventory-distribution');
  }

  getUserGrowth(): Observable<any[]> {
    return this.http.get<any[]>(API_URL + 'user-growth');
  }

  getLowStockTop(): Observable<any[]> {
    return this.http.get<any[]>(API_URL + 'low-stock-top');
  }
}
