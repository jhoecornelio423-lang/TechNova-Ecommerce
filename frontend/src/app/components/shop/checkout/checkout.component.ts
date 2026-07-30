import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../../../services/cart.service';
import { OrderService } from '../../../services/order.service';
import { StorageService } from '../../../services/storage.service';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    public cartService: CartService,
    private orderService: OrderService,
    private storageService: StorageService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.checkoutForm = this.fb.group({
      direccionEnvio: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    if (!this.storageService.isLoggedIn()) {
      this.toastService.show('Inicia sesión para finalizar tu compra', 'warning');
      this.router.navigate(['/login']);
      return;
    }

    if (this.cartService.items().length === 0) {
      this.router.navigate(['/home']);
    }
  }

  onSubmit(): void {
    if (this.checkoutForm.invalid) return;

    this.loading = true;

    const orderData = {
      direccionEnvio: this.checkoutForm.value.direccionEnvio,
      items: this.cartService.items().map(item => ({
        product: { id: item.product.id },
        cantidad: item.quantity
      }))
    };

    this.orderService.createOrder(orderData).subscribe({
      next: (res) => {
        this.toastService.show('¡Pedido realizado con éxito!', 'success');
        this.cartService.clearCart();
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Error al procesar pedido:', err);
        this.toastService.show(err.error || 'Error al procesar el pedido', 'danger');
        this.loading = false;
      }
    });
  }
}
