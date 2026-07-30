import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  @Output() closeCart = new EventEmitter<void>();

  constructor(
    public cartService: CartService,
    private router: Router
  ) {}

  onClose(): void {
    this.closeCart.emit();
  }

  goToCheckout(): void {
    this.onClose();
    this.router.navigate(['/checkout']);
  }
}
