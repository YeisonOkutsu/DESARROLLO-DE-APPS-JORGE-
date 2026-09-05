import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Usuario } from './usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly API_URL = 'https://jsonplaceholder.typicode.com/users';

  constructor(private http: HttpClient) {}

  obtenerUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.API_URL).pipe(
      catchError((error) => {
        console.error('Error al obtener usuarios:', error);
        return throwError(() => new Error('No se pudieron cargar los usuarios.'));
      })
    );
  }
}
