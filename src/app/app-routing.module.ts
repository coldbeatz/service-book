import { Routes } from '@angular/router';
import { LoginComponent } from "./components/entrance/login/login.component";
import { RegistrationComponent } from "./components/entrance/registration/registration.component";
import { RestoreComponent } from "./components/entrance/restore/restore.component";
import { ConfirmationComponent } from "./components/confirmation/confirmation.component";
import { ChangePasswordComponent } from "./components/restore/change-password/change-password.component";
import { BrandsComponent} from "./components/admin/brands/brands.component";
import { AuthGuard } from "./guards/auth.guard";
import { GuestGuard } from "./guards/guest.guard";
import { CarComponent } from "./components/admin/cars/car/car.component";
import { CarsComponent } from "./components/admin/cars/cars.component";
import { EngineComponent } from "./components/admin/cars/car/engines/engine/engine.component";
import { EnginesComponent } from "./components/admin/cars/car/engines/engines.component";
import { ServicesComponent } from "./components/admin/services/services.component";
import { BrandComponent } from "./components/admin/brands/brand/brand.component";
import { AlertsComponent } from "./components/admin/news/alerts.component";
import { SettingsComponent } from "./components/auth/settings/settings.component";
import { HomeComponent } from "./components/home/home.component";
import { UserCarsComponent } from "./components/auth/user-cars/user-cars.component";
import { UserCarComponent } from "./components/auth/user-cars/user-car/user-car.component";
import { CarMaintenanceComponent } from "./components/admin/cars/car/maintenance/car-maintenance.component";
import { CarResolver } from "./components/admin/cars/car/car.resolver";
import { UserCarNoteComponent } from "./components/auth/user-cars/user-car/notes/note/user-car-note.component";
import {
	UserCarEditorSettingsComponent
} from "./components/auth/user-cars/user-car/settings/user-car-editor-settings.component";
import { UserCarResolver } from "./components/auth/user-cars/user-car/user-car.resolver";
import { CarEditorComponent } from "./components/admin/cars/car/editor/car-editor.component";
import {
	UserCarMaintenanceComponent
} from "./components/auth/user-cars/user-car/maintenance/user-car-maintenance.component";
import { NotesComponent } from "./components/auth/user-cars/user-car/notes/notes.component";
import { AdminGuard } from "./guards/admin.guard";

export const routes: Routes = [

	/**
	 * Guest
	 */
	{ path: 'login', component: LoginComponent, canActivate: [GuestGuard] },
	{ path: 'registration', component: RegistrationComponent, canActivate: [GuestGuard] },
	{ path: 'restore', component: RestoreComponent, canActivate: [GuestGuard] },
	{ path: 'restore/:key', component: ChangePasswordComponent, canActivate: [GuestGuard] },

	/**
	 * Admin
	 */
	{ path: 'brands', component: BrandsComponent, canActivate: [AdminGuard] },
	{ path: 'brands/create', component: BrandComponent, canActivate: [AdminGuard] },
	{ path: 'brands/:id', component: BrandComponent, canActivate: [AdminGuard] },

	{
		path: 'cars/:brand',
		canActivate: [AdminGuard],
		children: [
			{ path: '', component: CarsComponent },

			{
				path: ':carId',
				component: CarComponent,
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

	{ path: 'alerts', component: AlertsComponent, canActivate: [AdminGuard] },
	{ path: 'services', component: ServicesComponent, canActivate: [AdminGuard] },

	/**
	 * User
	 */
	{ path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },

	{
		path: 'user-cars',
		canActivate: [AuthGuard],
		children: [
			{ path: '', component: UserCarsComponent },
			{
				path: ':userCarId',
				component: UserCarComponent,
				resolve: { userCar: UserCarResolver },
				children: [
					{ path: '', component: UserCarEditorSettingsComponent },
					{ path: 'maintenance', component: UserCarMaintenanceComponent },
					{ path: 'notes', component: NotesComponent },
					{ path: 'notes/:noteId', component: UserCarNoteComponent },
					{ path: 'notes/new', component: UserCarNoteComponent }
				]
			}
		]
	},

	/**
	 * All
	 */
	{ path: 'confirmation/:key', component: ConfirmationComponent },
	{ path: '', component: HomeComponent },
	{ path: '**', redirectTo: 'login' },
];
