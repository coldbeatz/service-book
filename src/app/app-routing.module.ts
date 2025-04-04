import { Routes } from '@angular/router';
import { LoginComponent } from "./components/pages/login/login.component";
import { RegistrationComponent } from "./components/pages/registration/registration.component";
import { RestoreComponent } from "./components/pages/restore/restore.component";
import { ConfirmationComponent } from "./components/pages/confirmation/confirmation.component";
import { ChangePasswordComponent } from "./components/pages/restore/change-password/change-password.component";
import { BrandsComponent} from "./components/pages/brands/brands.component";
import { AuthGuard } from "./guards/auth.guard";
import { GuestGuard } from "./guards/guest.guard";
import { CarComponent } from "./components/pages/cars/car/car.component";
import { CarsComponent } from "./components/pages/cars/cars.component";
import { EngineComponent } from "./components/pages/cars/car/engines/engine/engine.component";
import { EnginesComponent } from "./components/pages/cars/car/engines/engines.component";
import { ServicesComponent } from "./components/pages/services/services.component";
import { BrandComponent } from "./components/pages/brands/brand/brand.component";
import { AlertsComponent } from "./components/pages/alerts/alerts.component";
import { ProfileComponent } from "./components/pages/profile/profile.component";
import { HomeComponent } from "./components/pages/home/home.component";
import { UserCarsComponent } from "./components/pages/user-cars/user-cars.component";
import { UserCarComponent } from "./components/pages/user-cars/user-car/user-car.component";
import { CarResolver } from "./components/pages/cars/car/car.resolver";
import { UserCarNoteComponent } from "./components/pages/user-cars/user-car/notes/note/user-car-note.component";
import { UserCarEditorSettingsComponent } from "./components/pages/user-cars/user-car/settings/user-car-editor-settings.component";
import { UserCarResolver } from "./components/pages/user-cars/user-car/user-car.resolver";
import { CarEditorComponent } from "./components/pages/cars/car/editor/car-editor.component";
import { NotesComponent } from "./components/pages/user-cars/user-car/notes/notes.component";
import { AdminGuard } from "./guards/admin.guard";
import { SharedGuard } from "./guards/shared.guard";
import { Oauth2RedirectComponent } from "./components/pages/oauth2/redirect/oauth2-redirect.component";
import { UserCarMaintenanceComponent } from "./components/pages/user-cars/user-car/maintenance/user-car-maintenance.component";
import { CarMaintenanceComponent } from "./components/pages/cars/car/maintenance/car-maintenance.component";

export const routes: Routes = [
	{ path: 'oauth2/redirect', component: Oauth2RedirectComponent, canActivate: [GuestGuard] },

	{
		path: ':lang',
		children: [
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
			{ path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },

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
			{ path: '', component: HomeComponent, canActivate: [SharedGuard] },
			{ path: '**', redirectTo: '' },
		]
	},

	{ path: '', redirectTo: '/en', pathMatch: 'full' },
	{ path: '**', redirectTo: '/en' },
];
