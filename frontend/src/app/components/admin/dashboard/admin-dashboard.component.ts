import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService, DashboardStats } from '../../../services/admin.service';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  stats = signal<DashboardStats | null>(null);
  adminName = signal('Administrador');
  adminRole = signal('Panel de Control');
  currentDate = new Date();
  loading = signal(true);

  constructor(
    private adminService: AdminService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    const user = this.storageService.getUser();
    if (user) {
      this.adminName.set(user.fullName || user.username);

      if (user.roles && user.roles.includes('ROLE_ADMIN')) {
        this.adminRole.set('Administrador');
      } else {
        this.adminRole.set('Cliente');
      }
    }

    this.loadStats();
  }

  loadStats(): void {
    this.loading.set(true);
    this.adminService.getStats().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar estadísticas:', err);
        this.loading.set(false);
      }
    });
  }
}
