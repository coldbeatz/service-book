import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { AppComponent } from "./app.component";
import { NgModule } from "@angular/core";

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: AppComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {

}
