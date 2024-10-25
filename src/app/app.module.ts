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
import { provideHttpClient } from "@angular/common/http";
import { ConfirmationComponent } from "./components/confirmation/confirmation.component";
import { PasswordInputComponent } from "./components/registration/password-input/password-input.component";
import { ChangePasswordComponent } from "./components/restore/change-password/change-password.component";
import { NavigationService } from "./services/navigation.service";

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		PasswordInputComponent,
		RegistrationComponent,
		ChangePasswordComponent,
		RestoreComponent,
		ConfirmationComponent
	],
    imports: [
        BrowserModule,
        AppRoutingModule,
        AppTranslateModule,
        FontAwesomeModule,
        FormsModule,
        ReactiveFormsModule,
    ],
	providers: [provideHttpClient(), ApiRequestsService, NavigationService],
	bootstrap: [AppComponent]
})
export class AppModule { }
