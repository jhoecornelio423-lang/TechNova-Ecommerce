import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { StorageService } from './services/storage.service';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ToastComponent } from './components/shared/toast/toast.component';
import { ConfirmModalComponent } from './components/shared/confirm-modal/confirm-modal.component';
import { CartComponent } from './components/shop/cart/cart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, ToastComponent, ConfirmModalComponent, CartComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  showAdminBoard = false;
  displayName?: string;
  displayRole?: string;
  isAdminPage: boolean = false;
  isSidebarCollapsed: boolean = false;
  showCart = false;

  private authSubscription?: Subscription;

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    public cartService: CartService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // Escuchar el estado de autenticación de forma reactiva
    this.authSubscription = this.authService.user$.subscribe(user => {
      this.updateUserInfo(user);
    });

    // Escuchar cambios de ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateAdminStatus(event.url);
    });

    this.updateAdminStatus(this.router.url);
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    this.cdr.detectChanges();
  }

  toggleCart(): void {
    this.showCart = !this.showCart;
  }

  private updateUserInfo(user: any): void {
    this.isLoggedIn = user && user.token ? true : false;

    if (this.isLoggedIn) {
      const roles = user.roles || [];
      this.showAdminBoard = roles.includes('ROLE_ADMIN');
      this.displayName = user.fullName || user.username;
      this.displayRole = this.showAdminBoard ? 'Administrador' : 'Cliente';
    } else {
      this.showAdminBoard = false;
      this.displayName = undefined;
      this.displayRole = undefined;
    }

    this.cdr.detectChanges();
  }

  private updateAdminStatus(url: string): void {
    this.isAdminPage = url.startsWith('/admin');
    this.cdr.detectChanges();
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: err => console.error('Error al cerrar sesión:', err)
    });
  }
}
