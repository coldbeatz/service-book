import { Car } from "./car.model";

export interface Engine {
	id: number;
	name: string;
	displacement: number;
	fuelType: string;
	horsepower: number;
	createdAt: Date | null;
	updatedAt: Date | null;
	car: Car;
}
