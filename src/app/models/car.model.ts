import { Brand } from "./brand.model";
import { Resource } from "./resource.model";
import { Engine } from "./engine.model";
import { CarTransmissionType } from "./car-transmission-type.model";

export interface Car {
	id: number;
	brand: Brand;
	model: string;
	startYear: number;
	endYear: number;
	imageResource: Resource;
	createdAt: Date | null;
	updatedAt: Date | null;
	transmissions: CarTransmissionType[];
	engines: Engine[];
}
