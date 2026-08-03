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
      email: ['', [Validators.required, Validators.email]],
      dni: ['', [Validators.pattern('^[0-9]{8}$')]], // Opcional en perfil, validado si se pone
      direccion: ['', [Validators.minLength(10)]]
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
          email: userData.email,
          dni: userData.dni || '',
          direccion: userData.direccion || ''
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

        // Actualizar datos en el Storage (incluyendo los nuevos campos)
        const currentUser = this.storageService.getUser();
        const newUserSession = {
          ...currentUser,
          fullName: updatedUser.fullName,
          email: updatedUser.email,
          dni: updatedUser.dni,
          direccion: updatedUser.direccion
        };
        this.storageService.saveUser(newUserSession);

        this.authService.refreshUserState();
        this.saving.set(false);
      },
      error: (err) => {
        console.error('Error actualizando perfil:', err);
        // Extraer mensaje de error del servidor si existe
        const msg = err.error?.message || 'Error al intentar actualizar el perfil';
        this.toastService.show(msg, 'danger');
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
