import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { ConfirmService } from '../../services/confirm.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  products: Product[] = [];
  loading = true;

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
    private confirmService: ConfirmService
  ) {}

  ngOnInit(): void {
    console.log('Admin: Iniciando carga de inventario...');
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        console.log('Admin: Inventario recibido:', data);
        this.products = data;
        this.loading = false;
        this.cdr.detectChanges(); // Forzar actualización visual
      },
      error: (err) => {
        console.error('Admin: Error al cargar inventario:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteProduct(id: number): void {
    this.confirmService.confirm({
      title: 'Confirmar Eliminación',
      message: '¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.',
      confirmText: 'Eliminar Producto'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.productService.deleteProduct(id).subscribe({
          next: () => {
            this.products = this.products.filter(p => p.id !== id);
            this.toastService.show('Producto eliminado con éxito', 'success');
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            this.toastService.show('No se pudo eliminar el producto', 'danger');
          }
        });
      }
    });
  }
}
