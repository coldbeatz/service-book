import { MaintenanceWorkType } from "./maintenance-work-type.model";

/**
 * Завдання (операція) регламентного обслуговування, яка описує тип роботи, інтервал і специфічний пробіг
 */
export interface RegulationsMaintenanceTask {

	/**
	 * Ідентифікатор об'єкта в БД
	 */
	id: number;

	/**
	 * Технічне обслуговування інтервальне в кілометрах
	 */
	interval: number;

	/**
	 * Технічне обслуговування при визначеному пробігу в кілометрах
	 */
	specificMileage: number;

	/**
	 * Тип роботи (заміна, перевірка)
	 */
	workType: MaintenanceWorkType;
}
