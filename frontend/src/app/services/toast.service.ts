import { Injectable, signal } from '@angular/core';

export interface Toast {
  message: string;
  type: 'success' | 'danger' | 'warning' | 'info';
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts = signal<Toast[]>([]);
  public toasts$ = this.toasts;

  private counter = 0;

  show(message: string, type: 'success' | 'danger' | 'warning' | 'info' = 'success'): void {
    const id = this.counter++;
    const newToast: Toast = { id, message, type };

    this.toasts.update(current => [...current, newToast]);

    // Ocultar automáticamente después de 3 segundos
    setTimeout(() => {
      this.remove(id);
    }, 4000);
  }

  remove(id: number): void {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }
}
