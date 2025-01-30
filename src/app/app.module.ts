import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LoginComponent } from "./components/login/login.component";
import { AppComponent } from "./app.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { AppRoutingModule } from "./app-routing.module";
import { AppTranslateModule } from "./translate/translate.module";
import { RegistrationComponent } from "./components/registration/registration.component";
import { RestoreComponent } from "./components/restore/restore.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ApiRequestsService } from "./services/api-requests.service";
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import { ConfirmationComponent } from "./components/confirmation/confirmation.component";
import { PasswordInputComponent } from "./components/registration/password-input/password-input.component";
import { ChangePasswordComponent } from "./components/restore/change-password/change-password.component";
import { NavigationService } from "./services/navigation.service";
import {ApiErrorsService} from "./services/api-errors.service";
import {MainComponent} from "./components/internal/main/main.component";
import {HeaderComponent} from "./components/internal/main/header/header.component";
import {FooterComponent} from "./components/internal/main/footer/footer.component";
import {BrandsComponent} from "./components/admin/brands/brands.component";
import {NgOptimizedImage} from "@angular/common";
import {CreateBrandComponent} from "./components/admin/brands/create/create-brand.component";
import {CustomFileUploadComponent} from "./components/shared/custom-file-upload/custom-file-upload.component";
import {AuthInterceptor} from "./services/auth.interceptor";
import {EditBrandComponent} from "./components/admin/brands/edit/edit-brand.component";
import {AlertComponent} from "./components/internal/alert/alert.component";
import {CreateCarComponent} from "./components/admin/cars/create/create-car.component";
import {CarsComponent} from "./components/admin/cars/cars.component";
import {BreadcrumbComponent} from "./components/internal/breadcrumb/breadcrumb.component";
import {EngineComponent} from "./components/admin/cars/create/engines/engine/engine.component";
import {EnginesComponent} from "./components/admin/cars/create/engines/engines.component";
import {DropdownComponent} from "./components/shared/dropdown/dropdown.component";
import {ServicesComponent} from "./components/admin/services/services.component";
import {ServiceModalComponent} from "./components/admin/services/service-modal/service-modal.component";
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbPaginationModule, NgbAlertModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		PasswordInputComponent,
		RegistrationComponent,
		ChangePasswordComponent,
		RestoreComponent,
		ConfirmationComponent,

		HeaderComponent,
		FooterComponent,
		MainComponent,

		BrandsComponent,
		AlertComponent,
		CreateBrandComponent,
		EditBrandComponent,

		CarsComponent,
		CreateCarComponent,
		EnginesComponent,
		EngineComponent,
		ServicesComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		AppTranslateModule,
		FontAwesomeModule,
		FormsModule,
		ReactiveFormsModule,
		NgOptimizedImage,
		BreadcrumbComponent,
		DropdownComponent,
		CustomFileUploadComponent,
		ServiceModalComponent,
		NgxDatatableModule,
  NgbModule, NgbPaginationModule, NgbAlertModule
	],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AuthInterceptor,
			multi: true
		},
		provideHttpClient(withInterceptorsFromDi()),
		ApiRequestsService,
		ApiErrorsService,
		NavigationService
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
