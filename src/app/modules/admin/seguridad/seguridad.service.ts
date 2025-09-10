import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SeguridadService {
  private baseUrl = environment.baseUrl + '/api/Seguridad/';
  private baseMantenimientoUrl =  environment.baseUrl + '/api/Mantenimiento/';

  constructor(private http: HttpClient) {}

  listarUsuarios(criterio: string, rolId?: number): Observable<any[]> {
    let params = new HttpParams();
    if (criterio) params = params.set('criterio', criterio);
    if (rolId) params = params.set('rolId', rolId.toString());

    return this.http.get<any[]>(`${this.baseUrl}ListarUsuarios`, { params });
  }

  registrarUsuario(model: any): Observable<any> {
    return this.http.post(`${this.baseUrl}RegistrarUsuario`, model);
  }

  actualizarUsuario(model: any): Observable<any> {
    return this.http.put(`${this.baseUrl}ActualizarUsuario`, model);
  }

  eliminarUsuario(model: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}DeleteUsuario`, {
      body: { usr_int_id: model.id },
    });
  }

  listarSucursales(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseMantenimientoUrl}GetSucursalxCriterio`);
  }
}
