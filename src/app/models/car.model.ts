import { Brand } from "./brand.model";
import { Resource } from "./resource.model";
import { Engine } from "./engine.model";
import { CarTransmissionType } from "./car-transmission-type.model";

export class Car {
	id: number;
	brand: Brand | null;
	model: string;
	startYear: number;
	endYear: number;
	imageResource: Resource | null;
	createdAt: Date | null;
	updatedAt: Date | null;
	transmissions: CarTransmissionType[];
	engines: Engine[];

	constructor(car?: Partial<Car>) {
		this.id = car?.id ?? 0;
		this.brand = car?.brand ?? null;
		this.model = car?.model ?? '';
		this.startYear = car?.startYear ?? 0;
		this.endYear = car?.endYear ?? 0;
		this.imageResource = car?.imageResource ?? null;
		this.createdAt = car?.createdAt ?? null;
		this.updatedAt = car?.updatedAt ?? null;
		this.transmissions = car?.transmissions ?? [];
		this.engines = car?.engines ?? [];
	}
}
