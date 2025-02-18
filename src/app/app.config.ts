import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { FormatDatePipe } from './shared/pipes/format_date.pipe'; 
import { TruncateDecimalPipe } from './shared/pipes/truncate-decimal.pipe';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import MyPreset from '../../mypreset';
import { LocalstorageService } from './core/services/localstorage.service';
import { MessageService } from 'primeng/api';
 
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset:MyPreset,
        options: {
          darkModeSelector: '.dark-mode',
          cssLayer: {
            name: 'primeng',
            order: 'tailwind-base, primeng, tailwind-utilities',
          },
        },
      },
    }),
    FormatDatePipe,
    TruncateDecimalPipe,
    LocalstorageService,
    MessageService
  ],
};
