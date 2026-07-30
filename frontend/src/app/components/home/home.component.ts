import { Component, OnInit, ChangeDetectorRef, signal } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product, Category } from '../../models/product.model';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  selectedCategoryId: number | null = null;
  loading = true;

  showWelcomeMessage = signal(false);

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log('TechNova: Iniciando carga de catálogo...');

    this.route.queryParamMap.subscribe(params => {
      if (params.get('registered') === 'true') {
        this.showWelcomeMessage.set(true);
        this.cdr.detectChanges();
        setTimeout(() => {
          this.showWelcomeMessage.set(false);
          this.cdr.detectChanges();
        }, 7000);
      }
    });

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
        this.cdr.detectChanges();
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

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.toastService.show(`"${product.nombre}" añadido al carrito`, 'success');
  }

  buyNow(product: Product): void {
    this.cartService.addToCart(product);
    this.router.navigate(['/checkout']);
  }
}
