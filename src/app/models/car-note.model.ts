import { UserCar } from "./user-car.model";

export class CarNote {
	id: number | null;
	userCar?: UserCar;
	shortDescription: string;
	content: string;
	createdAt: Date | null;
	updatedAt: Date | null;

	constructor(note?: Partial<CarNote>) {
		this.id = note?.id ?? null;
		this.userCar = note?.userCar;
		this.shortDescription = note?.shortDescription ?? '';
		this.content = note?.content ?? '';
		this.createdAt = note?.createdAt ?? null;
		this.updatedAt = note?.updatedAt ?? null;
	}
}
