import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: any = {
    username: '',
    password: ''
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.redirectUser();
    }
  }

  onSubmit(): void {
    const { username, password } = this.form;

    this.authService.login(username, password).subscribe({
      next: data => {
        this.storageService.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;

        this.redirectUser();
      },
      error: err => {
        // Corrección: Manejo seguro de errores para evitar el crash "reading 'message' of null"
        if (err.status === 401) {
          this.errorMessage = 'Usuario o contraseña incorrectos';
        } else if (err.status === 500) {
          this.errorMessage = 'Error en el servidor. Por favor, revisa que la base de datos esté encendida.';
        } else {
          this.errorMessage = err.error?.message || 'Ocurrió un error inesperado al iniciar sesión';
        }

        this.isLoginFailed = true;
        console.error('Error de Login:', err);
      }
    });
  }

  private redirectUser(): void {
    const user = this.storageService.getUser();
    if (user.roles && user.roles.includes('ROLE_ADMIN')) {
      this.router.navigate(['/admin']).then(() => {
        window.location.reload();
      });
    } else {
      this.router.navigate(['/home']).then(() => {
        window.location.reload();
      });
    }
  }
}
