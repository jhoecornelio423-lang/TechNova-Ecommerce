import { Injectable, signal } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface ConfirmData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  private resultSubject = new Subject<boolean>();

  public isOpen = signal(false);
  public data = signal<ConfirmData>({ title: '', message: '' });

  confirm(data: ConfirmData): Observable<boolean> {
    this.data.set(data);
    this.isOpen.set(true);
    this.resultSubject = new Subject<boolean>();
    return this.resultSubject.asObservable();
  }

  onConfirm(): void {
    this.isOpen.set(false);
    this.resultSubject.next(true);
    this.resultSubject.complete();
  }

  onCancel(): void {
    this.isOpen.set(false);
    this.resultSubject.next(false);
    this.resultSubject.complete();
  }
}
