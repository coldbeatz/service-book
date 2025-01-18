import { Localized } from "./localized.model";
import {Resource} from "./resource.model";

export interface Country {
	id: number;
	code: string;
	name: Localized;
	iconResource: Resource;
}
