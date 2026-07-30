import { Component, OnInit, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, User } from '../../../services/user.service';
import { StorageService } from '../../../services/storage.service';
import { ToastService } from '../../../services/toast.service';
import { ConfirmService } from '../../../services/confirm.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  loading = true;
  currentUserId: number | null = null;

  // Gestión de Rangos
  showRoleModal = signal(false);
  selectedUser: User | null = null;
  availableRoles: any[] = [];
  selectedRoleNames: string[] = [];

  constructor(
    private userService: UserService,
    private storageService: StorageService,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
    private confirmService: ConfirmService
  ) {}

  ngOnInit(): void {
    const currentUser = this.storageService.getUser();
    this.currentUserId = currentUser ? currentUser.id : null;
    this.loadUsers();
    this.loadAvailableRoles();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadAvailableRoles(): void {
    this.userService.getAvailableRoles().subscribe({
      next: (roles) => this.availableRoles = roles,
      error: (err) => console.error('Error al cargar roles:', err)
    });
  }

  openRoleModal(user: User): void {
    if (user.id === this.currentUserId) {
        this.toastService.show('No puedes cambiar tu propio rango.', 'warning');
        return;
    }
    this.selectedUser = user;
    this.selectedRoleNames = user.roles.map(r => r.nombre);
    this.showRoleModal.set(true);
  }

  closeRoleModal(): void {
    this.showRoleModal.set(false);
    this.selectedUser = null;
  }

  toggleRole(roleName: string): void {
    const index = this.selectedRoleNames.indexOf(roleName);
    if (index > -1) {
      // No permitir dejar al usuario sin roles
      if (this.selectedRoleNames.length > 1) {
        this.selectedRoleNames.splice(index, 1);
      } else {
        this.toastService.show('El usuario debe tener al menos un rango.', 'warning');
      }
    } else {
      this.selectedRoleNames.push(roleName);
    }
  }

  saveRoles(): void {
    if (!this.selectedUser) return;

    this.userService.updateUserRoles(this.selectedUser.id, this.selectedRoleNames).subscribe({
      next: () => {
        this.toastService.show('Rango actualizado con éxito', 'success');
        this.loadUsers(); // Recargar tabla
        this.closeRoleModal();
      },
      error: (err) => {
        console.error('Error al actualizar rango:', err);
        this.toastService.show('No se pudo actualizar el rango.', 'danger');
      }
    });
  }

  deleteUser(user: User): void {
    if (user.id === this.currentUserId) {
      this.toastService.show('No puedes eliminar tu propia cuenta.', 'danger');
      return;
    }

    this.confirmService.confirm({
      title: 'Confirmar Eliminación',
      message: `¿Estás seguro de que deseas eliminar al usuario "${user.username}"? Esta acción es permanente.`,
      confirmText: 'Eliminar Usuario'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.userService.deleteUser(user.id).subscribe({
          next: () => {
            this.users = this.users.filter(u => u.id !== user.id);
            this.toastService.show('Usuario eliminado correctamente', 'success');
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error al eliminar usuario:', err);
            this.toastService.show('Error al intentar eliminar el usuario.', 'danger');
          }
        });
      }
    });
  }
}
