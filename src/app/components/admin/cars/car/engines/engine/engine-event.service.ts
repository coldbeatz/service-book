import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Engine } from "../../../../../../models/engine.model";

@Injectable({ providedIn: 'root' })
export class EngineEventService {

	public engineListChanged$ = new Subject<Engine[]>();
}
