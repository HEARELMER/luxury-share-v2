import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DragDropService {
  saveOrderToLocalStorage(key: string, items: any[]) {
    localStorage.setItem(key, JSON.stringify(items));
  }

  loadOrderFromLocalStorage(key: string): any[] | null {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : null;
  }

  updateOrder(items: any[], previousIndex: number, currentIndex: number): any[] {
    const newItems = [...items];
    const [removed] = newItems.splice(previousIndex, 1);
    newItems.splice(currentIndex, 0, removed);
    return newItems;
  }
}