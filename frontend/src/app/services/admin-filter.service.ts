import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminFilterService {
  searchQuery = '';
  selectedCategoryId: number | null = null;
  showLowStockOnly = false;

  reset(): void {
    this.searchQuery = '';
    this.selectedCategoryId = null;
    this.showLowStockOnly = false;
  }
}
