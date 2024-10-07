import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LoginComponent } from "./login/login.component";
import { AppComponent } from "./app.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { AppRoutingModule } from "./app-routing.module";
import { AppTranslateModule } from "./translate/translate.module";
import { RegistrationComponent } from "./registration/registration.component";
import { RestoreComponent } from "./restore/restore.component";
import { FormsModule } from "@angular/forms";
import { UserService } from "./user/user.service";
import { provideHttpClient } from "@angular/common/http";
import { ConfirmationComponent } from "./components/confirmation/confirmation.component";

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		RegistrationComponent,
		RestoreComponent,
		ConfirmationComponent
	],
    imports: [
        BrowserModule,
        AppRoutingModule,
        AppTranslateModule,
        FontAwesomeModule,
		FormsModule,
    ],
	providers: [provideHttpClient(), UserService],
	bootstrap: [AppComponent]
})
export class AppModule { }
