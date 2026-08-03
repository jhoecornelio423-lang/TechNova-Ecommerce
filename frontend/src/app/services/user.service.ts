import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = '/api/users';

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  dni?: string;
  direccion?: string;
  roles: any[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(API_URL);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/${id}`);
  }

  updateUserRoles(id: number, roles: string[]): Observable<any> {
    return this.http.put(`${API_URL}/${id}/roles`, roles);
  }

  getAvailableRoles(): Observable<any[]> {
    return this.http.get<any[]>('/api/roles');
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${API_URL}/me`);
  }

  updateProfile(data: any): Observable<User> {
    return this.http.put<User>(`${API_URL}/me`, data);
  }
}
