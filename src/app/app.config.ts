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
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { firebaseConfig } from './environments/environment.development';
import { pdfConfig } from './config/pdf.config';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { CloudStorageService } from './core/services/cloud-storage/cloud-storage.service';
import { ThemeService } from './core/ui-services/theme.service';
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
    providePdfConfig(pdfConfig),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideStorage(() => getStorage()),
    FormatDatePipe,
    TruncateDecimalPipe,
    LocalstorageService,
    MessageService,
    CapitalizePipe,
    FilterEmptyValuesPipe,
    ConfirmationService,
    CloudStorageService,
    ThemeService
  ],
};
