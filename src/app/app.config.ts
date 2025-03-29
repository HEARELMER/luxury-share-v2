import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { FormatDatePipe } from './shared/pipes/format_date.pipe';
import { TruncateDecimalPipe } from './shared/pipes/truncate-decimal.pipe';
import { providePrimeNG } from 'primeng/config';
import MyPreset from '../../mypreset';
import { LocalstorageService } from './core/services/localstorage-services/localstorage.service';
import { MessageService } from 'primeng/api';
import { CapitalizePipe } from './shared/pipes/capitalize.pipe';
import { FilterEmptyValuesPipe } from './shared/pipes/filter-empty-value.pipe';
import { providePdfConfig } from './core/services/pdf-services/pdf-generator.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: MyPreset,
        options: {
          darkModeSelector: '.dark-mode',
          cssLayer: {
            name: 'primeng',
            order: 'tailwind-base, primeng, tailwind-utilities',
          },
        },
      },
    }),
    providePdfConfig({
      branding: {
        companyName: 'Luxury Travels',
        logo: 'assets/img/logo.png',
        primaryColor: [47, 132, 71],
        secondaryColor: [0, 0, 0],
        textColor: [0, 0, 0],
      },
      metadata: {
        author: 'Tu Empresa',
        creator: 'Tu Empresa',
      },
      footer: {
        includePageNumbers: true,
        pageNumberFormat: 'Página {0} de {1}',
        text: '© Tu Empresa - 2025',
      },
    }),
    FormatDatePipe,
    TruncateDecimalPipe,
    LocalstorageService,
    MessageService,
    CapitalizePipe,
    FilterEmptyValuesPipe,
  ],
};
