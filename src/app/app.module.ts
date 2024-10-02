import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {LoginComponent} from "./login/login.component";
import {AppComponent} from "./app.component";
import {FaIconComponent, FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {AppRoutingModule} from "./app-routing.module";
import {AppTranslateModule} from "./translate/translate.module";

@NgModule({
  declarations: [
	AppComponent,
    LoginComponent
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
