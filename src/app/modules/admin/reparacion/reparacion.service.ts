import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { AprobarQcDto, CambiarTecnicoDto, FinalizarReparacionRequest, ListarOrdenTrabajoDetalleResult, ReparacionRequest, UsuarioDto } from './reparacion.types';



const httpOptions = {
  headers: new HttpHeaders({
    Authorization : 'Bearer ' + localStorage.getItem('token'),
    'Content-Type' : 'application/json'
  })
  // , observe: 'body', reportProgress: true };
};



@Injectable({
  providedIn: 'root'
})
export class ReparacionService {


private baseUrl = environment.baseUrl + '/api/Reparaciones/';

private baseMantenimientoUrl = environment.baseUrl + '/api/Mantenimiento/';
private _httpClient = inject(HttpClient);

  
constructor() { }




getRubros(): Observable<any[]> {
  return this._httpClient.get<any[]>(  `${this.baseUrl}Listar-Rubros`  , httpOptions);  
}


listarOrdenServicio(
  numeroorden: string,
  idtecnico: number,
  fechainicio: string,
  fechafin: string,
  idestado?: number,
  serie?: string
): Observable<any[]> {

  let params = new HttpParams().set('idtecnico', idtecnico.toString());

  if (fechainicio) {
    params = params.set('fecini', fechainicio);
  }

  if (fechafin) {
    params = params.set('fecfin', fechafin);
  }

  if (idestado !== undefined && idestado !== null) {
    params = params.set('idestado', idestado.toString());
  }

  if (serie) {
    params = params.set('serie', serie);
  }

  if (numeroorden) {
    params = params.set('NumOrdenServicio', numeroorden);
  }

  return this._httpClient.get<any[]>(`${this.baseUrl}ListarOrdenServicio`, {
    params,
    ...httpOptions,
  });
}



listarOrdenServicioTecnico(
  numeroorden: string,
  idtecnico: number,
  fechainicio: string,
  fechafin: string,
  idestado?: number,
  serie?  : string
): Observable<any[]> {


  // Construimos los parámetros
  let params = new HttpParams()
    .set('idtecnico', idtecnico.toString())
    .set('fecini', fechainicio)
    .set('fecfin', fechafin);

  // Solo agregamos parámetros opcionales si tienen un valor
  if (idestado !== undefined && idestado !== null) {
    params = params.set('idestado', idestado.toString());
  }

  if (serie) {
    params = params.set('serie', serie);
  }

  if (numeroorden) {
    params = params.set('NumOrdenServicio', numeroorden);
  }

  // Llamamos al servicio con los parámetros
  return this._httpClient.get<any[]>(`${this.baseUrl}ListarOrdenServicioTecnico`, {
    params,
    ...httpOptions,
  });
}
listarDiagnosticos(): Observable<any[]> {
  return this._httpClient.get<any[]>(`${this.baseUrl}ListarDiagnosticos`, httpOptions);
}

listarReparacionesPorCategoria(idCategoria: number): Observable<any[]> {
  return this._httpClient.get<any[]>(`${this.baseUrl}ListarReparaciones?idcategoriareparacion=${idCategoria}`, httpOptions);
}

listarRepuestos(idOrdenServicio: number, idreparacionsmartway: number): Observable<any[]> {
  return this._httpClient.get<any[]>(
    `${this.baseUrl}ListarRepuestos?idOrdenServicio=${idOrdenServicio}&idreparacionsmartway=${idreparacionsmartway}`,
    httpOptions
  );
}

uploadFile(usrid: number, file: File, oc: string, tipo: string) {
  const formData = new FormData();
  formData.append('file', file);

  const httpOptionsUpload = {
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    })
  };

  // Aquí especificamos responseType en la llamada al método post
  return this._httpClient.post(`${this.baseUrl}UploadFile?usrid=${usrid}&oc=${oc}&type=${tipo}`, formData, {
    ...httpOptionsUpload, // Desestructuramos httpOptionsUpload
    responseType: 'blob'   // Añadimos responseType aquí
  });
}

asignarOrdenTrabajo(idOrdenServicio: number, idTecnico: number): Observable<boolean> {
  const payload = {
    IdOrdenServicio: idOrdenServicio,
    IdTecnico: idTecnico
  };

  return this._httpClient.post<boolean>(`${this.baseUrl}AsignarTrabajo`, payload ,httpOptions);
}


agregarReparacion(request: ReparacionRequest): Observable<any> {
  return this._httpClient.post(`${this.baseUrl}agregar-reparacion`, request);
}
eliminarDetalleReparacion(idDetalle: number): Observable<any> {
  return this._httpClient.delete(`${this.baseUrl}detalle/${idDetalle}`);
}

finalizarReparacion(request: FinalizarReparacionRequest) {

  console.log('aca xD' ,request);
  return this._httpClient.put(`${this.baseUrl}finalizar-reparacion`, request);
}



pausarReparacion(idOrdenServicio: number): Observable<any> {
  return this._httpClient.put(`${this.baseUrl}pausar-reparacion/${idOrdenServicio}`, {});
}


getEstados(idTabla: number): Observable<any> {
  return this._httpClient.get(`${this.baseMantenimientoUrl}GetEstados`, {
    params: { IdTabla: idTabla.toString() }
  });
}

getTiempoOrdenTrabajo(idOrdenTrabajo: number): Observable<any[]> {
  return this._httpClient.get<any[]>(`${this.baseUrl}OrdenTrabajoTiempo/${idOrdenTrabajo}`);
}

iniciarReparacion(data: { Id: number, IdUsuario: number }): Observable<any> {
  return this._httpClient.post<any>(`${this.baseUrl}iniciar`, data);
}

getTecnicos(IdUsuario: number): Observable<UsuarioDto[]> {
  return this._httpClient.get<UsuarioDto[]>(
    `${this.baseUrl}listar-tecnicos?IdUser=${IdUsuario}`
  );
}

cambiarTecnico(dto: CambiarTecnicoDto): Observable<any> {
    return this._httpClient.put(`${this.baseUrl}cambiar-tecnico`, dto);
  }
  
  listarOrdenTrabajoDetalle(idOrdenTrabajo: number): Observable<ListarOrdenTrabajoDetalleResult[]> {
    return this._httpClient.get<ListarOrdenTrabajoDetalleResult[]>(`${this.baseUrl}detalle/${idOrdenTrabajo}`);
  }
  aprobarQC(dto: AprobarQcDto): Observable<{ res: boolean; mensaje: string }> {
    return this._httpClient.post<{ res: boolean; mensaje: string }>(`${this.baseUrl}aprobar-qc`, dto,  httpOptions);
  }

  asignarIrreparable(idOrdenServicio: number): Observable<{ res: boolean; mensaje: string }> {
  return this._httpClient.post<{ res: boolean; mensaje: string }>(
    `${this.baseUrl}asignar-irreparable`, 
    idOrdenServicio, httpOptions
  );
}
  asignarRemozado(idOrdenServicio: number): Observable<{ res: boolean; mensaje: string }> {
    return this._httpClient.post<{ res: boolean; mensaje: string }>(
      `${this.baseUrl}asignar-remozado`, 
      idOrdenServicio, httpOptions
    );
  }

  obtenerAntecedentes(idOrdenServicio: number): Observable<any> {
  return this._httpClient.get(`${this.baseUrl}antecedentes/${idOrdenServicio}`);
  }

}

