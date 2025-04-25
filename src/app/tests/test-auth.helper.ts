import { AuthService } from '../services/auth.service';
import { UserService } from '../services/api/user.service';

/**
 * Виконує логін перед інтеграційними тестами
 */
export function loginBeforeTests(userService: UserService, authService: AuthService, done: DoneFn): void {
	const loginRequest = {
		email: 'vbhrytsenko@gmail.com',
		password: '123123'
	};

	userService.login(loginRequest).subscribe({
		next: (response) => {
			authService.login(response.email, response.token, true);
			done();
		},
		error: (e) => {
			fail('Login failed before tests: ' + e.message);
			done();
		}
	});
}

export function base64ToFile(base64: string, filename: string, mimeType: string): File {
	const byteString = atob(base64.split(',')[1]);
	const byteArray = new Uint8Array(byteString.length);

	for (let i = 0; i < byteString.length; i++) {
		byteArray[i] = byteString.charCodeAt(i);
	}

	return new File([byteArray], filename, { type: mimeType });
}

export function getSimpleImageFile(): File {
	const base64 = 'data:image/png;base64,R0lGODlhDAAMAKIFAF5LAP/zxAAAANyuAP/gaP///wAAAAAAACH5BAEAAAUALAAAAAAMAAwAAAMlWLPcGjDKFYi9lxKBOaGcF35DhWHamZUW0K4mAbiwWtuf0uxFAgA7';
	return base64ToFile(base64, 'logo.png', 'image/png');
}
