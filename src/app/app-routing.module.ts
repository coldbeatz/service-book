import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "./components/login/login.component";
import { AppComponent } from "./app.component";
import { NgModule } from "@angular/core";
import { RegistrationComponent } from "./components/registration/registration.component";
import { RestoreComponent } from "./components/restore/restore.component";
import { ConfirmationComponent } from "./components/confirmation/confirmation.component";
import {ChangePasswordComponent} from "./components/restore/change-password/change-password.component";

export const routes: Routes = [
	{ path: 'login', component: LoginComponent },
	{ path: 'registration', component: RegistrationComponent },
	{ path: 'restore', component: RestoreComponent },
	{ path: 'restore/:key', component: ChangePasswordComponent },
	{ path: 'confirmation/:key', component: ConfirmationComponent },
	{ path: '', component: AppComponent },
	{ path: '**', redirectTo: 'login' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {

}
