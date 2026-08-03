import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product, Category } from '../../models/product.model';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { ConfirmService } from '../../services/confirm.service';
import { AdminFilterService } from '../../services/admin-filter.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  loading = true;

  constructor(
    private productService: ProductService,
    public filterService: AdminFilterService,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
    private confirmService: ConfirmService
  ) {}

  ngOnInit(): void {
    console.log('Admin: Iniciando carga de inventario...');
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Admin: Error al cargar categorías:', err)
    });
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

  // Lógica de Filtrado Reactivo
  get filteredProducts(): Product[] {
    return this.products.filter(p => {
      // 1. Filtro por nombre
      const matchesSearch = !this.filterService.searchQuery ||
        p.nombre.toLowerCase().includes(this.filterService.searchQuery.toLowerCase());

      // 2. Filtro por categoría
      const matchesCategory = this.filterService.selectedCategoryId === null ||
        p.categoria?.id === this.filterService.selectedCategoryId;

      // 3. Filtro por stock bajo
      const matchesStock = !this.filterService.showLowStockOnly || (p.stock || 0) < 10;

      return matchesSearch && matchesCategory && matchesStock;
    });
  }

  clearFilters(): void {
    this.filterService.reset();
    this.cdr.detectChanges();
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
