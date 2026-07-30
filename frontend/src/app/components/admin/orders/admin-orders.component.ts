import { Component, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { ToastService } from '../../../services/toast.service';
import { ConfirmService } from '../../../services/confirm.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss']
})
export class AdminOrdersComponent implements OnInit {
  orders = signal<any[]>([]);
  loading = signal(true);
  selectedOrder = signal<any | null>(null);

  constructor(
    private orderService: OrderService,
    private toastService: ToastService,
    private confirmService: ConfirmService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAllOrders();
  }

  loadAllOrders(): void {
    this.loading.set(true);
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.orders.set(data);
        this.loading.set(false);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando todos los pedidos:', err);
        this.loading.set(false);
      }
    });
  }

  updateStatus(order: any, newStatus: string): void {
    const msg = `¿Cambiar el estado del pedido #${order.id} a ${newStatus}?`;
    this.confirmService.confirm({
      title: 'Actualizar Estado',
      message: msg,
      confirmText: 'Actualizar'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.orderService.updateOrderStatus(order.id, newStatus).subscribe({
          next: () => {
            this.toastService.show('Estado actualizado correctamente', 'success');
            this.loadAllOrders();
          },
          error: () => this.toastService.show('Error al actualizar estado', 'danger')
        });
      }
    });
  }

  showDetails(order: any): void {
    this.selectedOrder.set(order);
  }

  closeDetails(): void {
    this.selectedOrder.set(null);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDIENTE': return 'bg-warning text-dark';
      case 'ENVIADO': return 'bg-primary';
      case 'ENTREGADO': return 'bg-success';
      case 'CANCELADO': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }
}
