import { Component, OnInit, ChangeDetectorRef, signal } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product, Category } from '../../models/product.model';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  selectedCategoryId: number | null = null;
  loading = true;

  // Búsqueda
  searchQuery = '';
  private searchSubject = new Subject<string>();

  // Ordenamiento
  sortOption = 'default';

  // Paginación
  currentPage = 1;
  pageSize = 21;

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
    // Configurar búsqueda reactiva
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(query => {
      this.performSearch(query);
    });

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
        this.products = data;
        this.applySort();
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

  onSearch(event: any): void {
    this.searchSubject.next(event.target.value);
  }

  performSearch(query: string): void {
    if (!query.trim()) {
      this.loadProducts();
      return;
    }

    this.loading = true;
    this.productService.searchProducts(query).subscribe({
      next: (data) => {
        this.products = data;
        this.applySort();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => this.loading = false
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
    this.searchQuery = ''; // Limpiar búsqueda al cambiar categoría
    this.currentPage = 1; // Resetear a la primera página
    this.loadProducts();
  }

  // Lógica de Paginación
  get pagedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.products.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.products.length / this.pageSize);
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.scrollToCatalog();
      this.cdr.detectChanges();
    }
  }

  onPageClick(page: number | string): void {
    if (page !== '...') {
      this.setPage(page as number);
    }
  }

  get visiblePages(): (number | string)[] {
    const total = this.totalPages;
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    if (this.currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, '...', total);
    } else if (this.currentPage >= total - 3) {
      pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total);
    } else {
      pages.push(1, '...', this.currentPage - 1, this.currentPage, this.currentPage + 1, '...', total);
    }
    return pages;
  }

  setSort(option: string): void {
    this.sortOption = option;
    this.applySort();
  }

  applySort(): void {
    if (this.sortOption === 'price-asc') {
      this.products.sort((a, b) => a.precio - b.precio);
    } else if (this.sortOption === 'price-desc') {
      this.products.sort((a, b) => b.precio - a.precio);
    } else if (this.sortOption === 'name') {
      this.products.sort((a, b) => a.nombre.localeCompare(b.nombre));
    }
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.toastService.show(`"${product.nombre}" añadido al carrito`, 'success');
  }

  buyNow(product: Product): void {
    this.cartService.addToCart(product);
    this.router.navigate(['/checkout']);
  }

  scrollToCatalog(): void {
    const catalog = document.getElementById('catalog-section');
    if (catalog) {
      catalog.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
