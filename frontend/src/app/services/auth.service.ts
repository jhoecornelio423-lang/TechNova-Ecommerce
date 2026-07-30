import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { StorageService } from './storage.service';

const AUTH_API = '/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Subject para notificar cambios en la sesión a toda la app
  private userSubject: BehaviorSubject<any>;
  public user$: Observable<any>;

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
    // Inicializar el subject dentro del constructor para poder usar storageService
    const initialUser = this.storageService.getUser();
    this.userSubject = new BehaviorSubject<any>(initialUser);
    this.user$ = this.userSubject.asObservable();
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signin',
      { username, password },
      httpOptions
    ).pipe(
      tap(user => {
        this.storageService.saveUser(user);
        this.userSubject.next(user); // Notificar que alguien inició sesión
      })
    );
  }

  register(username: string, email: string, password: string, fullName: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signup',
      { username, email, password, fullName },
      httpOptions
    );
  }

  logout(): Observable<any> {
    return this.http.post(AUTH_API + 'signout', { }, httpOptions).pipe(
      tap(() => {
        this.storageService.clean();
        this.userSubject.next({}); // Notificar que la sesión se cerró
      })
    );
  }

  // Método para refrescar el estado (útil tras cambios externos)
  refreshUserState(): void {
    this.userSubject.next(this.storageService.getUser());
  }
}
