import { Localized } from "./localized.model";
import { RegulationsMaintenanceTask } from "./regulations-maintenance-task.model";
import { CarTransmissionType } from "./car-transmission-type.model";
import { FuelType } from "./fuel-type.model";

/**
 * Регламенте технічне обслуговування
 */
export interface RegulationsMaintenance {

	/**
	 * Ідентифікатор об'єкта в БД
	 */
	id: number;

	/**
	 * Локалізований опис роботи регламентного обслуговування
	 */
	workDescription: Localized;

	/**
	 * Використовувати за замовчуванням для кожного авто, якщо збігається трансмісія або тип палива
	 */
	useDefault: boolean;

	/**
	 * Трансмісії які обслуговуються при даній роботі
	 */
	transmissions: CarTransmissionType[];

	/**
	 * Типи палива авто які обслуговуються при даній роботі
	 */
	fuelTypes: FuelType[];

	/**
	 * Задачі (операції) регламентного обслуговування.
	 * Один регламент може містити кілька завдань (наприклад, перевірка і заміна)
	 */
	tasks: RegulationsMaintenanceTask[];
}
