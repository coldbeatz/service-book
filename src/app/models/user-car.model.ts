import { Resource } from "./resource.model";
import { Car } from "./car.model";
import { Engine } from "./engine.model";
import { CarTransmissionType } from "./car-transmission-type.model";
import { FuelType } from "./fuel-type.model";

export class UserCar {

	/**
	 * Ідентифікатор об'єкта в БД
	 */
	id: number | null;

	/**
	 * Автомобіль
	 */
	car: Car | null;

	/**
	 * Двигун автомобіля
	 */
	engine: Engine | null;

	/**
	 * Рік випуску автомобіля
	 */
	vehicleYear: number | null;

	/**
	 * VIN-код автомобіля
	 */
	vinCode: string;

	/**
	 * Тип трансмісії автомобіля (автомат, механіка, і т.д.)
	 */
	transmissionType: CarTransmissionType | null;

	/**
	 * Тип палива (напр. бензин, дизель, електро)
	 */
	fuelType: FuelType | null;

	/**
	 * Пробіг автомобіля
	 */
	vehicleMileage: number;

	/**
	 * Ресурс зображення автомобіля користувача
	 */
	imageResource: Resource | null;

	constructor(userCar?: Partial<UserCar>) {
		this.id = userCar?.id ?? null;
		this.car = userCar?.car ?? null;
		this.engine = userCar?.engine ?? null;
		this.vehicleYear = userCar?.vehicleYear ?? null; //new Date().getFullYear();
		this.vinCode = userCar?.vinCode ?? '';
		this.transmissionType = userCar?.transmissionType ?? null;
		this.fuelType = userCar?.fuelType ?? null;
		this.vehicleMileage = userCar?.vehicleMileage ?? 0;
		this.imageResource = userCar?.imageResource ?? null;
	}
}
