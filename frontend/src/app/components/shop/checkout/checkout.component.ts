import { Component, OnInit, signal, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../../../services/cart.service';
import { OrderService } from '../../../services/order.service';
import { StorageService } from '../../../services/storage.service';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../services/toast.service';
import { ConfirmService } from '../../../services/confirm.service';
import { TermsComponent } from '../../shared/terms/terms.component';
import { GeocodingService } from '../../../services/geocoding.service';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import * as L from 'leaflet';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TermsComponent],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, AfterViewInit, OnDestroy {
  checkoutForm: FormGroup;
  loading = false;
  showTerms = false;

  // Lógica de Envío
  readonly STORE_LOCATION = { lat: -12.046374, lng: -77.042793 }; // Plaza de Armas Lima
  readonly STORE_ADDRESS = "Tienda Principal TechNova - Plaza de Armas, Cercado de Lima, Perú";
  readonly BASE_FEE = 5.00;
  readonly PER_KM_FEE = 1.50;

  shippingCost = signal(0);
  distance = signal(0);
  deliveryMethod = signal<'DELIVERY' | 'RECOJO'>('DELIVERY');

  // Lógica de Cupón
  appliedCoupon = signal<any>(null);
  couponCode = '';
  validatingCoupon = false;

  // Leaflet Map Properties
  private map?: L.Map;
  private marker?: L.Marker;
  private defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  private addressSearchSubject = new Subject<string>();

  constructor(
    private fb: FormBuilder,
    public cartService: CartService,
    private orderService: OrderService,
    private storageService: StorageService,
    private userService: UserService,
    private authService: AuthService,
    private geocodingService: GeocodingService,
    private router: Router,
    private toastService: ToastService,
    private confirmService: ConfirmService
  ) {
    this.checkoutForm = this.fb.group({
      nombreCliente: ['', [Validators.required, Validators.minLength(3)]],
      emailCliente: ['', [Validators.required, Validators.email]],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      direccionEnvio: ['', [Validators.required, Validators.minLength(10)]],
      aceptaTerminos: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
    if (!this.storageService.isLoggedIn()) {
      this.toastService.show('Inicia sesión para comprar', 'warning');
      this.router.navigate(['/login']);
      return;
    }

    if (this.cartService.items().length === 0) {
      this.router.navigate(['/home']);
      return;
    }

    this.loadUserData();

    this.addressSearchSubject.pipe(
      debounceTime(800),
      distinctUntilChanged()
    ).subscribe(address => {
      if (address && address.length > 10 && this.deliveryMethod() === 'DELIVERY') {
        this.searchAddressOnMap(address);
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initMap(), 100);
  }

  ngOnDestroy(): void {
    if (this.map) this.map.remove();
  }

  private initMap(): void {
    this.map = L.map('map-container', {
        scrollWheelZoom: true,
        fadeAnimation: true
    }).setView([this.STORE_LOCATION.lat, this.STORE_LOCATION.lng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    setTimeout(() => this.map?.invalidateSize(), 500);

    // Solo geolocalizar si es Delivery
    if (this.deliveryMethod() === 'DELIVERY') {
        this.map.locate({ setView: true, maxZoom: 16 });
    }

    this.map.on('locationfound', (e) => {
        if (this.deliveryMethod() === 'DELIVERY') {
            this.updateMarker(e.latlng.lat, e.latlng.lng);
            this.calculateShipping(e.latlng.lat, e.latlng.lng);
        }
    });

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      if (this.deliveryMethod() === 'DELIVERY') {
        this.updateMarker(e.latlng.lat, e.latlng.lng);
        this.getAddress(e.latlng.lat, e.latlng.lng);
        this.calculateShipping(e.latlng.lat, e.latlng.lng);
      }
    });
  }

  setDeliveryMethod(method: 'DELIVERY' | 'RECOJO'): void {
    this.deliveryMethod.set(method);

    if (method === 'RECOJO') {
      this.shippingCost.set(0);
      this.distance.set(0);
      this.checkoutForm.patchValue({ direccionEnvio: this.STORE_ADDRESS });
      this.map?.setView([this.STORE_LOCATION.lat, this.STORE_LOCATION.lng], 16);
      this.updateMarker(this.STORE_LOCATION.lat, this.STORE_LOCATION.lng, false); // No arrastrable
    } else {
      this.loadUserData(); // Restaurar dirección guardada si existe
      this.map?.locate({ setView: true, maxZoom: 16 });
    }
  }

  private updateMarker(lat: number, lng: number, draggable: boolean = true): void {
    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
      if (draggable) this.marker.dragging?.enable();
      else this.marker.dragging?.disable();
    } else {
      this.marker = L.marker([lat, lng], {
        draggable: draggable,
        icon: this.defaultIcon
      }).addTo(this.map!);

      this.marker.on('dragend', () => {
        if (this.deliveryMethod() === 'DELIVERY') {
            const pos = this.marker!.getLatLng();
            this.getAddress(pos.lat, pos.lng);
            this.calculateShipping(pos.lat, pos.lng);
        }
      });
    }
  }

  private calculateShipping(lat: number, lng: number): void {
    if (this.deliveryMethod() === 'RECOJO') {
      this.shippingCost.set(0);
      this.distance.set(0);
      return;
    }

    const dist = this.getDistance(this.STORE_LOCATION.lat, this.STORE_LOCATION.lng, lat, lng);
    const cost = this.BASE_FEE + (dist * this.PER_KM_FEE);
    this.distance.set(parseFloat(dist.toFixed(2)));
    this.shippingCost.set(Math.round(cost));
  }

  private getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private getAddress(lat: number, lng: number): void {
    this.geocodingService.reverseGeocode(lat, lng).subscribe({
      next: (address) => {
        this.checkoutForm.patchValue({ direccionEnvio: address }, { emitEvent: false });
      }
    });
  }

  onAddressInput(event: any): void {
    this.addressSearchSubject.next(event.target.value);
  }

  private searchAddressOnMap(address: string): void {
    this.geocodingService.searchAddress(address).subscribe({
      next: (result) => {
        if (result) {
          const lat = parseFloat(result.lat);
          const lon = parseFloat(result.lon);
          this.map?.setView([lat, lon], 16);
          this.updateMarker(lat, lon);
          this.calculateShipping(lat, lon);
        }
      }
    });
  }

  loadUserData(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.checkoutForm.patchValue({
          nombreCliente: user.fullName,
          emailCliente: user.email,
          dni: user.dni || '',
          direccionEnvio: user.direccion || ''
        });

        if (user.direccion && this.deliveryMethod() === 'DELIVERY') {
            this.searchAddressOnMap(user.direccion);
        }
      }
    });
  }

  onSubmit(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    const methodText = this.deliveryMethod() === 'DELIVERY' ? 'Envío a Domicilio' : 'Recojo en Tienda';

    const msg = `
      <div class="text-start">
        <p class="mb-2"><strong>Método:</strong> ${methodText}</p>
        <p class="mb-2"><strong>DNI:</strong> ${this.checkoutForm.value.dni}</p>
        <p class="mb-2"><strong>Dirección:</strong> ${this.checkoutForm.value.direccionEnvio}</p>
        ${this.deliveryMethod() === 'DELIVERY' ? `<p class="mb-2"><strong>Costo Envío:</strong> S/ ${this.shippingCost()}</p>` : ''}
        <p class="mb-0 text-dark h5"><strong>Total a pagar:</strong> S/ ${Math.round(this.cartService.totalPrice() + this.shippingCost())}</p>
        <hr>
        <p class="text-primary fw-bold mb-0">¿Confirmas que estos datos son correctos?</p>
      </div>
    `;

    this.confirmService.confirm({
      title: 'Confirmación de Pedido',
      message: msg,
      confirmText: 'SÍ, CONFIRMO',
      confirmType: 'primary'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.processOrder();
      }
    });
  }

  private processOrder(): void {
    this.loading = true;
    const form = this.checkoutForm.value;

    const orderData = {
      customerName: form.nombreCliente,
      customerEmail: form.emailCliente,
      dni: form.dni,
      shippingAddress: form.direccionEnvio,
      shippingCost: this.shippingCost(),
      deliveryMethod: this.deliveryMethod(),
      items: this.cartService.items().map(item => ({
        product: { id: item.product.id },
        cantidad: item.quantity
      }))
    };

    this.orderService.createOrder(orderData).subscribe({
      next: () => {
        this.toastService.show('¡Pedido realizado con éxito!', 'success');

        // Guardar solo si es Delivery
        if (this.deliveryMethod() === 'DELIVERY') {
            this.userService.updateProfile({
                fullName: form.nombreCliente,
                email: form.emailCliente,
                dni: form.dni,
                direccion: form.direccionEnvio
            }).subscribe();
        }

        this.cartService.clearCart();
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.toastService.show(err.error || 'Error al procesar el pedido', 'danger');
        this.loading = false;
      }
    });
  }

  toggleTerms(): void {
    this.showTerms = !this.showTerms;
  }

  applyCoupon(): void {
    if (!this.couponCode.trim()) return;

    this.validatingCoupon = true;
    this.orderService.validateCoupon(this.couponCode.toUpperCase()).subscribe({
      next: (coupon) => {
        this.appliedCoupon.set(coupon);
        this.toastService.show(`Cupón ${coupon.codigo} aplicado: -${coupon.descuentoPorcentaje}%`, 'success');
        this.validatingCoupon = false;
      },
      error: (err) => {
        this.toastService.show(err.error || 'Error al aplicar cupón', 'danger');
        this.validatingCoupon = false;
        this.appliedCoupon.set(null);
      }
    });
  }

  get totalAfterCoupon(): number {
    const subtotal = this.cartService.totalPrice() + this.shippingCost();
    if (this.appliedCoupon()) {
      const discount = subtotal * (this.appliedCoupon().descuentoPorcentaje / 100);
      return Math.round(subtotal - discount);
    }
    return Math.round(subtotal);
  }
}
