import { Routes } from '@angular/router';
import { LoginComponent } from "./components/login/login.component";
import { RegistrationComponent } from "./components/registration/registration.component";
import { RestoreComponent } from "./components/restore/restore.component";
import { ConfirmationComponent } from "./components/confirmation/confirmation.component";
import { ChangePasswordComponent } from "./components/restore/change-password/change-password.component";
import { BrandsComponent} from "./components/admin/brands/brands.component";
import { AuthGuard } from "./guards/auth.guard";
import { GuestGuard } from "./guards/guest.guard";
import { CarComponent } from "./components/admin/cars/create/car.component";
import { CarsComponent } from "./components/admin/cars/cars.component";
import { EngineComponent } from "./components/admin/cars/create/engines/engine/engine.component";
import { EnginesComponent } from "./components/admin/cars/create/engines/engines.component";
import { ServicesComponent } from "./components/admin/services/services.component";
import { BrandComponent } from "./components/admin/brands/brand/brand.component";
import { AlertsComponent } from "./components/admin/news/alerts.component";
import { SettingsComponent } from "./components/auth/settings/settings.component";
import { MainComponent } from "./components/internal/main/main.component";
import { HomeComponent } from "./components/home/home.component";
import { UserCarsComponent } from "./components/auth/user-cars/user-cars.component";
import { UserCarEditorComponent } from "./components/auth/user-cars/user-car-editor/user-car-editor.component";
import { CarMaintenanceComponent } from "./components/admin/cars/create/maintenance/car-maintenance.component";
import { CarEditorComponent } from "./components/admin/cars/create/editor/car-editor.component";
import { CarResolver } from "./components/admin/cars/create/car.resolver";

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

	{
		path: 'cars/:brand',
		children: [
			{ path: 'create', component: CarComponent, canActivate: [AuthGuard] },
			{
				path: ':carId',
				component: CarComponent,
				canActivate: [AuthGuard],
				resolve: { car: CarResolver },
				children: [
					{ path: '', component: CarEditorComponent },
					{ path: 'maintenance', component: CarMaintenanceComponent },
					{ path: 'engines', component: EnginesComponent },
					{ path: 'engines/create', component: EngineComponent },
					{ path: 'engines/:engine', component: EngineComponent }
				]
			}
		]
	},

	{ path: 'alerts', component: AlertsComponent, canActivate: [AuthGuard] },
	{ path: 'services', component: ServicesComponent, canActivate: [AuthGuard] },

	{ path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },

	{ path: 'user-cars', component: UserCarsComponent, canActivate: [AuthGuard] },
	{ path: 'user-cars/new', component: UserCarEditorComponent, canActivate: [AuthGuard] },
	{ path: 'user-cars/:userCarId', component: UserCarEditorComponent, canActivate: [AuthGuard] },

	{ path: '', component: HomeComponent },

	//{ path: '', component: AppComponent },
	{ path: '**', redirectTo: 'login' }
];
