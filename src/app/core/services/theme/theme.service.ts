import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  constructor() {}

  // BehaviorSubject: esto emite valores iniciales o el último valor
  //  emitido antes de completarse.
  private _darkMode = new BehaviorSubject<boolean>(window.matchMedia('(prefers-color-scheme: dark)').matches);
  isDarkMode = this._darkMode.asObservable();
 

   setDarkMode(value:boolean){
    this._darkMode.next(value);
    // alert('setDarkMode' + value)
   }

   private menuVisibleSource = new BehaviorSubject<boolean>(true);
  menuVisible$ = this.menuVisibleSource.asObservable();

  toggleMenu() {
    this.menuVisibleSource.next(!this.menuVisibleSource.value);
  }
}
