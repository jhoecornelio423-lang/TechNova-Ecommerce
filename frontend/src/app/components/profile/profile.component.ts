import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService, User } from '../../services/user.service';
import { StorageService } from '../../services/storage.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  user = signal<User | null>(null);
  loading = signal(false);
  saving = signal(false);

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private storageService: StorageService,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading.set(true);
    this.userService.getCurrentUser().subscribe({
      next: (userData) => {
        this.user.set(userData);
        this.profileForm.patchValue({
          fullName: userData.fullName,
          email: userData.email
        });
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando perfil:', err);
        this.toastService.show('Error al cargar datos del perfil', 'danger');
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) return;

    this.saving.set(true);
    this.userService.updateProfile(this.profileForm.value).subscribe({
      next: (updatedUser) => {
        this.toastService.show('Perfil actualizado correctamente', 'success');

        // Actualizar datos en el Storage para que la Navbar se refresque
        const currentUser = this.storageService.getUser();
        const newUserSession = {
          ...currentUser,
          fullName: updatedUser.fullName,
          email: updatedUser.email
        };
        this.storageService.saveUser(newUserSession);

        // Avisar al AuthService para que emita el nuevo estado
        this.authService.refreshUserState();

        this.saving.set(false);
      },
      error: (err) => {
        console.error('Error actualizando perfil:', err);
        this.toastService.show('Error al actualizar el perfil', 'danger');
        this.saving.set(false);
      }
    });
  }

  getInitials(): string {
    const name = this.user()?.fullName || this.user()?.username || '?';
    return name.charAt(0).toUpperCase();
  }

  getRoles(): string {
    return this.user()?.roles.map(r => r.nombre.replace('ROLE_', '')).join(', ') || 'Cliente';
  }
}
