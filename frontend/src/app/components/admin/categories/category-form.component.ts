import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {
  categoryForm: FormGroup;
  isEditMode = false;
  categoryId: number | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {
    this.categoryForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.params['id'];
    if (this.categoryId) {
      this.isEditMode = true;
      this.loadCategoryData(this.categoryId);
    }
  }

  loadCategoryData(id: number): void {
    this.loading = true;
    this.http.get<any>(`/api/categories`).subscribe({
      next: (list) => {
        const cat = list.find((c: any) => c.id == id);
        if (cat) {
          this.categoryForm.patchValue(cat);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar categoría', err);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) return;

    this.loading = true;
    const data = this.categoryForm.value;

    if (this.isEditMode && this.categoryId) {
      this.http.put(`/api/categories/${this.categoryId}`, data).subscribe({
        next: () => {
          this.toastService.show('Categoría actualizada correctamente', 'success');
          this.router.navigate(['/admin/categories']);
        },
        error: () => {
          this.toastService.show('Error al actualizar categoría', 'danger');
          this.loading = false;
        }
      });
    } else {
      this.http.post(`/api/categories`, data).subscribe({
        next: () => {
          this.toastService.show('Categoría creada correctamente', 'success');
          this.router.navigate(['/admin/categories']);
        },
        error: () => {
          this.toastService.show('Error al crear categoría', 'danger');
          this.loading = false;
        }
      });
    }
  }
}
