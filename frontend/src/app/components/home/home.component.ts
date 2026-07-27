import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product, Category } from '../../models/product.model';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  selectedCategoryId: number | null = null;
  loading = true;

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    console.log('TechNova: Iniciando carga de catálogo...');
    this.loadCategories();
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    const request = this.selectedCategoryId
      ? this.productService.getProductsByCategory(this.selectedCategoryId)
      : this.productService.getAllProducts();

    request.subscribe({
      next: (data) => {
        console.log('TechNova: Productos cargados con éxito', data);
        this.products = data;
        this.loading = false;
        this.cdr.detectChanges(); // Forzar a la pantalla a actualizarse
      },
      error: (err) => {
        console.error('TechNova: Error al cargar productos', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('TechNova: Error al cargar categorías', err)
    });
  }

  filterByCategory(id: number | null): void {
    this.selectedCategoryId = id;
    this.loadProducts();
  }
}
