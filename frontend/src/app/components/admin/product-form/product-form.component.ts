import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Category } from '../../../models/product.model';
import { ToastService } from '../../../services/toast.service';
import { forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  categories: Category[] = [];
  isEditMode = false;
  productId: number | null = null;
  loading = false;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {
    this.productForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      categoria: this.fb.group({
        id: [null, Validators.required]
      }),
      talla: ['', Validators.required],
      color: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.productId;
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.loading = true;

    // Cargamos categorías y, si estamos editando, también el producto simultáneamente
    const categories$ = this.productService.getCategories();
    const product$ = this.isEditMode && this.productId
      ? this.productService.getProductById(this.productId)
      : of(null);

    forkJoin({
      categories: categories$,
      product: product$
    }).subscribe({
      next: (result) => {
        this.categories = result.categories;

        if (result.product) {
          this.productForm.patchValue({
            nombre: result.product.nombre,
            descripcion: result.product.descripcion,
            precio: result.product.precio,
            stock: result.product.stock,
            categoria: { id: result.product.categoria.id },
            talla: result.product.talla,
            color: result.product.color
          });
          this.imagePreview = result.product.imagenUrl;
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando datos iniciales:', err);
        this.toastService.show('Error al cargar la información del formulario', 'danger');
        this.loading = false;
      }
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid || (!this.isEditMode && !this.selectedFile)) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const productData = this.productForm.value;

    if (this.isEditMode && this.productId) {
      this.productService.updateProduct(this.productId, productData, this.selectedFile || undefined).subscribe({
        next: () => {
          this.toastService.show('Producto actualizado con éxito', 'success');
          this.router.navigate(['/admin/inventory']);
        },
        error: (err) => {
          console.error('Error al actualizar', err);
          this.toastService.show('No se pudo actualizar el producto', 'danger');
          this.loading = false;
        }
      });
    } else {
      if (this.selectedFile) {
        this.productService.createProduct(productData, this.selectedFile).subscribe({
          next: () => {
            this.toastService.show('Producto creado con éxito', 'success');
            this.router.navigate(['/admin/inventory']);
          },
          error: (err) => {
            console.error('Error al crear', err);
            this.toastService.show('No se pudo crear el producto', 'danger');
            this.loading = false;
          }
        });
      }
    }
  }
}
