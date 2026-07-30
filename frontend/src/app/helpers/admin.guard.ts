import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { StorageService } from '../services/storage.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const storageService = inject(StorageService);
  const router = inject(Router);

  if (storageService.isLoggedIn()) {
    const user = storageService.getUser();
    if (user.roles && user.roles.includes('ROLE_ADMIN')) {
      return true;
    }
  }

  // Si no es admin, redirigir al home o login
  router.navigate(['/home']);
  return false;
};
