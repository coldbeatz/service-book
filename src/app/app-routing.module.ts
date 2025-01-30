import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "./components/login/login.component";
import { NgModule } from "@angular/core";
import { RegistrationComponent } from "./components/registration/registration.component";
import { RestoreComponent } from "./components/restore/restore.component";
import { ConfirmationComponent } from "./components/confirmation/confirmation.component";
import { ChangePasswordComponent } from "./components/restore/change-password/change-password.component";
import { MainComponent } from "./components/internal/main/main.component";
import { BrandsComponent} from "./components/admin/brands/brands.component";
import { AuthGuard } from "./guards/auth.guard";
import { GuestGuard } from "./guards/guest.guard";
import { CreateBrandComponent } from "./components/admin/brands/create/create-brand.component";
import {EditBrandComponent} from "./components/admin/brands/edit/edit-brand.component";
import {CreateCarComponent} from "./components/admin/cars/create/create-car.component";
import {CarsComponent} from "./components/admin/cars/cars.component";
import {EngineComponent} from "./components/admin/cars/create/engines/engine/engine.component";
import {EnginesComponent} from "./components/admin/cars/create/engines/engines.component";
import {ServicesComponent} from "./components/admin/services/services.component";

export const routes: Routes = [

	{ path: 'login', component: LoginComponent, canActivate: [GuestGuard] },
	{ path: 'registration', component: RegistrationComponent, canActivate: [GuestGuard] },
	{ path: 'restore', component: RestoreComponent, canActivate: [GuestGuard] },
	{ path: 'restore/:key', component: ChangePasswordComponent, canActivate: [GuestGuard] },

	{ path: 'confirmation/:key', component: ConfirmationComponent },

	{ path: 'test', component: MainComponent, canActivate: [AuthGuard] },

	{ path: 'brands', component: BrandsComponent, canActivate: [AuthGuard] },
	{ path: 'brands/create', component: CreateBrandComponent, canActivate: [AuthGuard] },
	{ path: 'brands/:id', component: EditBrandComponent, canActivate: [AuthGuard] },

	{ path: 'cars/:id', component: CarsComponent, canActivate: [AuthGuard] },
	{ path: 'cars/:id/create', component: CreateCarComponent, canActivate: [AuthGuard] },
	{ path: 'cars/:id/:carId', component: CreateCarComponent, canActivate: [AuthGuard] },

	{ path: 'cars/:brand/:car/engines', component: EnginesComponent, canActivate: [AuthGuard] },
	{ path: 'cars/:brand/:car/engines/create', component: EngineComponent, canActivate: [AuthGuard] },
	{ path: 'cars/:brand/:car/engines/:engine', component: EngineComponent, canActivate: [AuthGuard] },

	{ path: 'services', component: ServicesComponent, canActivate: [AuthGuard] },

	//{ path: '', component: AppComponent },
	{ path: '**', redirectTo: 'login' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {

}
