import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStateService } from '../data-access/auth-state.service';

export const privateGuard = (): CanActivateFn => {
  return () => {
    const authState = inject(AuthStateService);
    const router = inject(Router);

    const session = authState.getSession();

    if (session) {
      return true;
    }

    router.navigateByUrl('/auth/log-in');

    return false;
  };
};

export const publicGuard: CanActivateFn = () => {
  const authState = inject(AuthStateService);
  const router = inject(Router);

  const session = authState.getSession();

  if (session) {
    router.navigateByUrl('/dashboard');
    return false; // ✅ Devuelve false correctamente para detener la navegación
  }

  return true; // ✅ Permite acceder solo si NO hay sesión
};