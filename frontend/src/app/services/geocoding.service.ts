import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  private http = inject(HttpClient);

  // Convierte coordenadas en dirección de texto (Gratis con Nominatim)
  reverseGeocode(lat: number, lng: number): Observable<string> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    return this.http.get<any>(url, {
      headers: { 'User-Agent': 'TechNova-Ecommerce-App' }
    }).pipe(
      map(res => res && res.display_name ? res.display_name : 'Dirección no encontrada')
    );
  }

  // Convierte texto en coordenadas (Gratis con Nominatim)
  searchAddress(query: string): Observable<any> {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
    return this.http.get<any[]>(url, {
      headers: { 'User-Agent': 'TechNova-Ecommerce-App' }
    }).pipe(
      map(results => results.length > 0 ? results[0] : null)
    );
  }
}
