import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";

import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { routes } from './app-routing.module';
import { AuthInterceptor } from "./services/auth.interceptor";

import { providePrimeNG } from "primeng/config";

import Aura from '@primeng/themes/aura';
import Lara from '@primeng/themes/lara';
import Nora from '@primeng/themes/nora';
import { ConfirmationService, MessageService } from "primeng/api";
import { provideAnimations } from "@angular/platform-browser/animations";

export function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AuthInterceptor,
			multi: true
		},
		provideHttpClient(withInterceptorsFromDi()),
		provideZoneChangeDetection({
			eventCoalescing: true,
			runCoalescing: true
	  	}),
		provideRouter(routes, withComponentInputBinding()),
		importProvidersFrom(
			TranslateModule.forRoot({
				loader: {
					provide: TranslateLoader,
					useFactory: HttpLoaderFactory,
					deps: [HttpClient]
				},
				defaultLanguage: 'en'
			})
		),
		provideAnimationsAsync(),
		providePrimeNG({
			theme: {
				preset: Aura
			}
		}),
		MessageService,
		ConfirmationService
	]
};
