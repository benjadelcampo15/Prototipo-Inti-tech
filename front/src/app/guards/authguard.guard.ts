import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  if (!token) {
    alert('El usuario tiene que estar logueado');
    router.navigate(['inicio/login']);
    return false; // Previene la navegación si no hay token
  }
  return true; // Permite la navegación si hay token
};
