import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { StorageService } from '../../shared/data-access/storage.service';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

interface UserAuthenticatedRequest {
  id: number;
  email: string;
}

interface TaskRequest {
  title: string;
  date: Date;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private _http = inject(HttpClient);

  private _storage = inject(StorageService);

  constructor() {}

  findAllTaskByUserId(
    userId: number,
    page: number,
    size: number
  ): Observable<any> {
    const token = JSON.parse(
      localStorage.getItem('session') || '{}'
    )?.accessToken;

    if (!token) {
      console.error('⚠️ No hay token disponible');
      return throwError(() => new Error('No token available'));
    }

    // 🟢 CORRECCIÓN: `HttpParams` debe inicializarse correctamente
    const params = new HttpParams()
      .set('page', page.toString()) // Convierte los números a string
      .set('pageSize', size.toString()); // Asegúrate de que sea 'size' si el backend lo usa así

    const options = {
      params, // 🔥 Esto ya está bien
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`, // 🟢 Token correcto
        'Content-Type': 'application/json',
      }),
    };

    return this._http
      .get<any>(`${environment.API_URL}/users/${userId}/tasks`, options)
      .pipe(
        //tap((response) => console.log('✅ Tareas obtenidas:', response)),
        catchError((error) => {
          console.error('❌ Error obteniendo tareas:', error);
          return throwError(() => error);
        })
      );
  }

  addTask(title: string, date: Date, description: string, userId: number) {
    const token = JSON.parse(
      localStorage.getItem('session') || '{}'
    )?.accessToken;

    if (!token) {
      console.error('⚠️ No hay token disponible');
      return throwError(() => new Error('No token available'));
    }

    const taskRequest = {
      title,
      description,
      date, // Asegúrate de que está en el formato correcto
    };

    const options = { // 🔥 Esto ya está bien
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`, // 🟢 Token correcto
        'Content-Type': 'application/json',
      }),
    };
    return this._http
      .post<any>(`${environment.API_URL}/users/${userId}/tasks`, taskRequest, options)
      .pipe(
        tap((response) => console.log('✅ Tareas creada:', response)),
        catchError((error) => {
          console.error('❌ Error creando tareas:', error);
          return throwError(() => error);
        })
      );
  }


  deleteTask(userId: number, taskId: number) {

    const token = JSON.parse(
      localStorage.getItem('session') || '{}'
    )?.accessToken;
    const options = { // 🔥 Esto ya está bien
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`, // 🟢 Token correcto
        'Content-Type': 'application/json',
      }),
    };
    return this._http.delete(`${environment.API_URL}/users/${userId}/tasks/${taskId}`, options); // Reemplaza con la URL correcta de tu backend
  }



  updateTask(userId: number, taskId: number, title: string, date: Date, description: string) {
    

    const taskRequest = {
      title,
      description,
      date, // Asegúrate de que está en el formato correcto
    };

    const token = JSON.parse(
      localStorage.getItem('session') || '{}'
    )?.accessToken;
    const options = { // 🔥 Esto ya está bien
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`, // 🟢 Token correcto
        'Content-Type': 'application/json',
      }),
    };

    return this._http.patch(`${environment.API_URL}/users/${userId}/tasks/${taskId}`, taskRequest, options ); // Reemplaza con la URL correcta de tu backend


  }

}
