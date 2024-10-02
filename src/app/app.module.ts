import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {LoginComponent} from "./login/login.component";
import {AppComponent} from "./app.component";
import {FaIconComponent, FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {RouterModule} from "@angular/router";
import {AppRoutingModule} from "./app-routing.module";

@NgModule({
  declarations: [
	AppComponent,
    LoginComponent
  ],
    imports: [
        BrowserModule,
		AppRoutingModule,
		FontAwesomeModule,
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
