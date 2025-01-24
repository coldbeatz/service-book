import { Brand } from "./brand.model";
import { Resource } from "./resource.model";
import { Engine } from "./engine.model";

export interface Car {
	id: number;
	brand: Brand;
	model: string;
	startYear: number;
	endYear: number;
	imageResource: Resource;
	createdAt: Date | null;
	updatedAt: Date | null;
	transmissions: string[];
	engines: Engine[];
}
