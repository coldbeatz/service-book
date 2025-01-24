import { Country } from "./country.model";
import { Resource } from "./resource.model";

export interface Brand {
	id: number;
	brand: string;
	country: Country | null;
	imageResource: Resource;
}
