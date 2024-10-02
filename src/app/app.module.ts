import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {LoginComponent} from "./login/login.component";
import {AppComponent} from "./app.component";

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppComponent,
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }
