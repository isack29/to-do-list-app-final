import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { StorageService } from '../../shared/data-access/storage.service';

@Injectable({
  providedIn: 'root',
})

export class AuthService {

  private _http = inject(HttpClient);

  private _storage = inject(StorageService);

  constructor() {}

  /**
   * Realiza una solicitud HTTP para registrarse con un nombre de usuario,
   * email y contrase a. Si el servidor devuelve un token de acceso, se
   * almacena en el almacenamiento local.
   *
   * @param name El nombre de usuario
   * @param email El email del usuario
   * @param password La contrase a del usuario
   * @returns Una observable que contiene la respuesta del servidor
   */



  logIn(email: string, password: string): Observable<any> {
    return this._http
      .post(`${environment.API_URL}/auth/log-in`, { email, password })
      .pipe(
        tap((response: any) => {
          const userData = response?.data; // Guarda todo el objeto de usuario
          if (userData && userData.accessToken) {
            this._storage.set('session', JSON.stringify(userData));
          }
        })
      );
  }
  
  signUp(name: string, email: string, password: string): Observable<any> {
    return this._http
      .post(`${environment.API_URL}/auth/sign-up`, { name, email, password })
      .pipe(
        tap((response: any) => {
          const userData = response?.data;
          if (userData && userData.accessToken) {
            this._storage.set('session', JSON.stringify(userData));
          }
        })
      );
  }

  getUserId(): number {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id; // Ajusta esto según cómo almacenes la sesión del usuario
  }


  
}
