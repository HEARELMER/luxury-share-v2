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
import { ConfirmationService, MessageService } from 'primeng/api';
import { CapitalizePipe } from './shared/pipes/capitalize.pipe';
import { FilterEmptyValuesPipe } from './shared/pipes/filter-empty-value.pipe';
import { providePdfConfig } from './core/services/pdf-services/pdf-generator.config';

const year = new Date().getFullYear();
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
        companyName: '20605053913 - AYACUCHO LUXURY TRAVEL S.R.L',
        logo: './images/logo.png',
        primaryColor: [255, 35, 35],
        secondaryColor: [0, 0, 0],
        textColor: [0, 0, 0],
      },
      metadata: {
        author: '20605053913 - AYACUCHO LUXURY TRAVEL S.R.L',
        creator: '20605053913 - AYACUCHO LUXURY TRAVEL S.R.L',
      },
      fonts: {
        default: 'helvetica',
        titleSize: 16,
        subtitleSize: 14,
        normalSize: 12,
        smallSize: 10,
      },
      tables: {
        theme: 'striped',
        headerColors: {
          fill:[255, 240, 240],
          text:[255, 35, 35],
        },
        alternateRowColors: [
          [249, 249, 250], // Azul muy claro
          [255, 255, 255], // Blanco
        ],
      },
      footer: {
        includePageNumbers: true,
        pageNumberFormat: ' {0} de {1}',
        text: `© AYACUCHO LUXURY TRAVEL S.R.L - ${year}`,
      },
    }),
    FormatDatePipe,
    TruncateDecimalPipe,
    LocalstorageService,
    MessageService,
    CapitalizePipe,
    FilterEmptyValuesPipe,
    ConfirmationService
  ],
};
