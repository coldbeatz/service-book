import { Role } from "../services/auth.service";

export class User {

	/**
	 * Ідентифікатор користувача в БД
	 */
	id: number | null;

	/**
	 * Електронна адреса користувача
	 */
	email: string;

	/**
	 * Ім'я користувача
	 */
	fullName: string;

	/**
	 * Пароль користувача
	 */
	password: string | null;

	/**
	 * Чи підписаний користувач на email-розсилку
	 */
	enableEmailNewsletter: boolean;

	role: Role | null;

	constructor(user?: Partial<User>) {
		this.id = user?.id ?? null;
		this.email = user?.email ?? '';
		this.fullName = user?.fullName ?? '';
		this.password = user?.password ?? null;
		this.enableEmailNewsletter = user?.enableEmailNewsletter ?? false;
		this.role = user?.role ?? null;
	}
}
