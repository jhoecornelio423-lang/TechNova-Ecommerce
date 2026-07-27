import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, Category } from '../models/product.model';

const API_URL = '/api/';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(API_URL + 'products');
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(API_URL + 'products/' + id);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(API_URL + 'categories');
  }

  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(API_URL + 'products/category/' + categoryId);
  }
}
