import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private API_URL = '/api/orders';

  constructor(private http: HttpClient) { }

  createOrder(orderData: any): Observable<any> {
    return this.http.post(this.API_URL, orderData);
  }

  getMyOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/my-orders`);
  }

  getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL);
  }

  updateOrderStatus(id: number, status: string): Observable<any> {
    // Usando concatenación clásica para evitar confusiones con template literals en el IDE
    return this.http.put(this.API_URL + '/' + id + '/status', status);
  }

  validateCoupon(code: string): Observable<any> {
    return this.http.get(`/api/coupons/validate/${code}`);
  }
}
