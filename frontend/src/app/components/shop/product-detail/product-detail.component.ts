import { Component, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { Product } from '../../../models/product.model';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product = signal<Product | null>(null);
  relatedProducts = signal<Product[]>([]);
  loading = signal(true);
  quantity = signal(1);

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private toastService: ToastService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Escuchar cambios en los parámetros de la URL para recargar cuando cambie el ID
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadProduct(Number(id));
      }
    });
  }

  loadProduct(id: number): void {
    this.loading.set(true);
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product.set(data);
        this.loadRelated(id);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando detalle:', err);
        this.loading.set(false);
      }
    });
  }

  loadRelated(id: number): void {
    this.productService.getRelatedProducts(id).subscribe({
      next: (data) => this.relatedProducts.set(data),
      error: (err) => console.error('Error cargando relacionados:', err)
    });
  }

  updateQuantity(val: number): void {
    const newQty = this.quantity() + val;
    if (newQty >= 1 && newQty <= (this.product()?.stock || 1)) {
      this.quantity.set(newQty);
    }
  }

  addToCart(product?: Product): void {
    const p = product || this.product();
    if (p) {
      this.cartService.addToCart(p);
      this.toastService.show(`"${p.nombre}" añadido al carrito`, 'success');
    }
  }

  buyNow(): void {
    const p = this.product();
    if (p) {
      this.cartService.addToCart(p);
      this.router.navigate(['/checkout']);
    }
  }
}
