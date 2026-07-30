import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form: any = {
    username: '',
    email: '',
    password: '',
    fullName: ''
  };
  isSignUpFailed = false;
  errorMessage = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void { }

  onSubmit(): void {
    const { username, email, password, fullName } = this.form;
    this.loading = true;

    // 1. Registrar al usuario
    this.authService.register(username, email, password, fullName).subscribe({
      next: data => {
        console.log('Registro exitoso, iniciando sesión automática...');

        // 2. Iniciar sesión automáticamente tras registro exitoso
        this.authService.login(username, password).subscribe({
          next: () => {
            this.loading = false;
            // 3. Redirigir al Home ya logueado
            this.router.navigate(['/home'], { queryParams: { registered: 'true' } });
          },
          error: err => {
            console.error('Error en auto-login:', err);
            this.loading = false;
            // Si el auto-login falla, mandamos al login manual
            this.router.navigate(['/login']);
          }
        });
      },
      error: err => {
        this.errorMessage = err.error.message || 'Error al registrar usuario';
        this.isSignUpFailed = true;
        this.loading = false;
      }
    });
  }
}
