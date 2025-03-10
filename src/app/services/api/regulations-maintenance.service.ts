import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { RegulationsMaintenance } from "../../models/regulations-maintenance.model";

@Injectable({
	providedIn: 'root'
})
export class RegulationsMaintenanceService {

	private readonly API_URL: string = `${environment.apiUrl}/admin/regulations_maintenance`;

	constructor(private http: HttpClient) {

	}

	/**
	 * Отримує список регламентного технічного обслуговування
	 *
	 * @returns Observable<RegulationsMaintenance[]>
	 */
	public getRegulationsMaintenance(): Observable<RegulationsMaintenance[]> {
		return this.http.get<RegulationsMaintenance[]>(`${this.API_URL}`);
	}

	/**
	 * Оновлює або зберігає регламентне технічне обслуговування
	 *
	 * @param maintenance Регламенте технічне обслуговування
	 *
	 * @returns Observable<RegulationsMaintenance>
	 */
	public saveOrUpdateRegulationsMaintenance(maintenance: RegulationsMaintenance): Observable<RegulationsMaintenance> {
		const url = this.API_URL;

		return maintenance.id
			? this.http.put<RegulationsMaintenance>(`${url}/${maintenance.id}`, maintenance)
			: this.http.post<RegulationsMaintenance>(url, maintenance);
	}

	/**
	 * Видалити регламентне обслуговування
	 *
	 * @param maintenance Регламентне обслуговування
	 *
	 * @returns Observable<void>
	 */
	public deleteRegulationsMaintenance(maintenance: RegulationsMaintenance): Observable<void> {
		const url = `${this.API_URL}/${maintenance.id}`;
		return this.http.delete<void>(url);
	}
}
