import { inject, Injectable } from '@angular/core';
import { StorageService } from './storage.service';

interface Session {
  accessToken: string;
}

interface UserAuthenticatedRequest {
  id: number;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  
  /**
   * Recupera el objeto de autenticaci n del usuario actual
   * desde el almacenamiento local.
   *
   * @returns Un objeto con la informaci n del usuario autenticado.
   * El objeto contiene las propiedades `id` y `email`.
   */
  getUserAuth(): UserAuthenticatedRequest {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user;
  }
  private _storageService = inject(StorageService);

  singOut() {
    this._storageService.remove('session');
  }

  getSession(): Session | null {
    let currentSession: Session | null = null;

    const maybeSession = this._storageService.get<Session>('session');
    //console.log(maybeSession);

    if (maybeSession !== null) {
      if (this._isValidSession(maybeSession)) {
        currentSession = maybeSession;
      } else {
        this.singOut();
      }
    }

    return currentSession;
  }

  private _isValidSession(maybeSession: unknown): boolean {
    const isValidSession =
      typeof maybeSession === 'object' &&
      maybeSession !== null &&
      'accessToken' in maybeSession;

    return isValidSession;
  }

  getUserId(): number {
    const sessionRaw = localStorage.getItem('session');
    //console.log('Contenido en localStorage:', sessionRaw); // 👀 Verifica el valor real
  
    if (!sessionRaw) {
      //console.log('⚠️ No hay sesión en localStorage (desde auth-state.service.ts)');
      return 0;
    }
  
    const session = JSON.parse(sessionRaw);
    //console.log('Sesión parseada:', session); // 👀 Verifica si tiene `id`
  
    return session?.id || 0; // Accede directamente a `id`
  }
}
