import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Category } from '../../../models/product.model';
import { ToastService } from '../../../services/toast.service';

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
    this.loadCategories();

    this.productId = this.route.snapshot.params['id'];
    if (this.productId) {
      this.isEditMode = true;
      this.loadProductData(this.productId);
    }
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Error al cargar categorías', err)
    });
  }

  loadProductData(id: number): void {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          nombre: product.nombre,
          descripcion: product.descripcion,
          precio: product.precio,
          stock: product.stock,
          categoria: { id: product.categoria.id },
          talla: product.talla,
          color: product.color
        });
        this.imagePreview = product.imagenUrl;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar producto', err);
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
