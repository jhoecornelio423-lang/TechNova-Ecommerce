import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Category } from '../../../models/product.model';
import { ToastService } from '../../../services/toast.service';
import { ConfirmService } from '../../../services/confirm.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  loading = true;

  constructor(
    private productService: ProductService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
    private confirmService: ConfirmService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.productService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteCategory(id: number): void {
    this.confirmService.confirm({
      title: 'Confirmar Eliminación',
      message: '¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer si tiene productos asociados.',
      confirmText: 'Eliminar Categoría'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.http.delete(`/api/categories/${id}`).subscribe({
          next: () => {
            this.categories = this.categories.filter(c => c.id !== id);
            this.toastService.show('Categoría eliminada con éxito', 'success');
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error al eliminar categoría:', err);
            this.toastService.show('No se pudo eliminar la categoría. Asegúrate de que no tenga productos vinculados.', 'danger');
          }
        });
      }
    });
  }
}
