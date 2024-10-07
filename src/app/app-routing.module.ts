import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { AppComponent } from "./app.component";
import { NgModule } from "@angular/core";
import { RegistrationComponent } from "./registration/registration.component";
import { RestoreComponent } from "./restore/restore.component";
import { ConfirmationComponent } from "./components/confirmation/confirmation.component";

export const routes: Routes = [
	{ path: 'login', component: LoginComponent },
	{ path: 'registration', component: RegistrationComponent },
	{ path: 'restore', component: RestoreComponent },
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
