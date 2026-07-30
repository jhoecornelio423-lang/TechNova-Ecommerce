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

  createProduct(product: any, image: File): Observable<Product> {
    const formData = new FormData();
    formData.append('nombre', product.nombre);
    formData.append('descripcion', product.descripcion);
    formData.append('precio', product.precio.toString());
    formData.append('stock', product.stock.toString());
    formData.append('categoriaId', product.categoria.id.toString());
    formData.append('talla', product.talla);
    formData.append('color', product.color);
    formData.append('image', image);

    return this.http.post<Product>(API_URL + 'products', formData);
  }

  updateProduct(id: number, product: any, image?: File): Observable<Product> {
    const formData = new FormData();
    formData.append('nombre', product.nombre);
    formData.append('descripcion', product.descripcion);
    formData.append('precio', product.precio.toString());
    formData.append('stock', product.stock.toString());
    formData.append('categoriaId', product.categoria.id.toString());
    formData.append('talla', product.talla);
    formData.append('color', product.color);

    if (image) {
      formData.append('image', image);
    }

    return this.http.put<Product>(API_URL + 'products/' + id, formData);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(API_URL + 'products/' + id);
  }
}
