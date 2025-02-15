import { Routes } from '@angular/router';
import { LoginComponent } from "./components/login/login.component";
import { RegistrationComponent } from "./components/registration/registration.component";
import { RestoreComponent } from "./components/restore/restore.component";
import { ConfirmationComponent } from "./components/confirmation/confirmation.component";
import { ChangePasswordComponent } from "./components/restore/change-password/change-password.component";
import { MainComponent } from "./components/internal/main/main.component";
import { BrandsComponent} from "./components/admin/brands/brands.component";
import { AuthGuard } from "./guards/auth.guard";
import { GuestGuard } from "./guards/guest.guard";
import { CreateCarComponent } from "./components/admin/cars/create/create-car.component";
import { CarsComponent } from "./components/admin/cars/cars.component";
import { EngineComponent } from "./components/admin/cars/create/engines/engine/engine.component";
import { EnginesComponent } from "./components/admin/cars/create/engines/engines.component";
import { ServicesComponent } from "./components/admin/services/services.component";
import { BrandComponent } from "./components/admin/brands/brand/brand.component";
import { AlertsComponent } from "./components/admin/alerts/alerts.component";
import { SettingsComponent } from "./components/auth/settings/settings.component";

export const routes: Routes = [

	{ path: 'login', component: LoginComponent, canActivate: [GuestGuard] },
	{ path: 'registration', component: RegistrationComponent, canActivate: [GuestGuard] },
	{ path: 'restore', component: RestoreComponent, canActivate: [GuestGuard] },
	{ path: 'restore/:key', component: ChangePasswordComponent, canActivate: [GuestGuard] },

	{ path: 'confirmation/:key', component: ConfirmationComponent },

	{ path: 'test', component: MainComponent, canActivate: [AuthGuard] },

	{ path: 'brands', component: BrandsComponent, canActivate: [AuthGuard] },
	{ path: 'brands/create', component: BrandComponent, canActivate: [AuthGuard] },
	{ path: 'brands/:id', component: BrandComponent, canActivate: [AuthGuard] },

	{ path: 'cars/:brand', component: CarsComponent, canActivate: [AuthGuard] },
	{ path: 'cars/:brand/create', component: CreateCarComponent, canActivate: [AuthGuard] },
	{ path: 'cars/:brand/:carId', component: CreateCarComponent, canActivate: [AuthGuard] },
	{ path: 'cars/:brand/:car/engines', component: EnginesComponent, canActivate: [AuthGuard] },
	{ path: 'cars/:brand/:car/engines/create', component: EngineComponent, canActivate: [AuthGuard] },
	{ path: 'cars/:brand/:car/engines/:engine', component: EngineComponent, canActivate: [AuthGuard] },

	{ path: 'alerts', component: AlertsComponent, canActivate: [AuthGuard] },
	{ path: 'services', component: ServicesComponent, canActivate: [AuthGuard] },

	{ path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },

	//{ path: '', component: AppComponent },
	{ path: '**', redirectTo: 'login' }
];
