import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { AppComponent } from "./app.component";
import { NgModule } from "@angular/core";
import { RegistrationComponent } from "./registration/registration.component";
import { RestoreComponent } from "./restore/restore.component";

export const routes: Routes = [
	{ path: 'login', component: LoginComponent },
	{ path: 'registration', component: RegistrationComponent },
	{ path: 'restore', component: RestoreComponent },
	{ path: '', component: AppComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {

}
