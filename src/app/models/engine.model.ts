import { Car } from "./car.model";
import { FuelType } from "./fuel-type.model";

export interface Engine {
	id: number;
	name: string;
	displacement: number;
	fuelType: FuelType;
	horsepower: number;
	createdAt: Date | null;
	updatedAt: Date | null;
	car: Car;
}
