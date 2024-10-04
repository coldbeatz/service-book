import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LoginComponent } from "./login/login.component";
import { AppComponent } from "./app.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { AppRoutingModule } from "./app-routing.module";
import { AppTranslateModule } from "./translate/translate.module";
import { RegistrationComponent } from "./registration/registration.component";
import { RestoreComponent } from "./restore/restore.component";

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		RegistrationComponent,
		RestoreComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		AppTranslateModule,
		FontAwesomeModule,
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
