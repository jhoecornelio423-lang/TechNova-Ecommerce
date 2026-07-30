import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<CartItem[]>(this.loadCart());

  // Selectores reactivos
  public items = computed(() => this.cartItems());

  public totalItems = computed(() =>
    this.cartItems().reduce((acc, item) => acc + item.quantity, 0)
  );

  public totalPrice = computed(() =>
    this.cartItems().reduce((acc, item) => acc + (item.product.precio * item.quantity), 0)
  );

  constructor() {}

  private loadCart(): CartItem[] {
    const savedCart = localStorage.getItem('technova_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  }

  private saveCart(items: CartItem[]): void {
    localStorage.setItem('technova_cart', JSON.stringify(items));
  }

  addToCart(product: Product): void {
    this.cartItems.update(currentItems => {
      const existingItem = currentItems.find(item => item.product.id === product.id);

      let updatedItems;
      if (existingItem) {
        updatedItems = currentItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedItems = [...currentItems, { product, quantity: 1 }];
      }

      this.saveCart(updatedItems);
      return updatedItems;
    });
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    this.cartItems.update(currentItems => {
      const updatedItems = currentItems.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      this.saveCart(updatedItems);
      return updatedItems;
    });
  }

  removeFromCart(productId: number): void {
    this.cartItems.update(currentItems => {
      const updatedItems = currentItems.filter(item => item.product.id !== productId);
      this.saveCart(updatedItems);
      return updatedItems;
    });
  }

  clearCart(): void {
    this.cartItems.set([]);
    localStorage.removeItem('technova_cart');
  }
}
