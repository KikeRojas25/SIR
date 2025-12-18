import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { DocumentoRecepcion, DocumentoRecepcionDetalle } from './cic.type';

@Injectable({
  providedIn: 'root'
})
export class CicService {

  private _httpClient = inject(HttpClient);
  private baseUrl = environment.baseUrl + '/api/mantenimiento/';
  private baseRecepcionUrl = environment.baseUrl + '/api/recepcion/';

  constructor() { }

  // ---------- 📌 Subir archivo ----------
  uploadFile(usrid: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    const httpOptionsUpload = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };

    return this._httpClient.post(`${this.baseRecepcionUrl}UploadFile?usrid=${usrid}`, formData, httpOptionsUpload);
  }

  // ---------- 📌 Procesar masivo ----------
  procesarMasivo(data: any): Observable<any> {
    return this._httpClient.post(`${this.baseRecepcionUrl}ProcesarMasivo`, data);
  }

  // ---------- 📌 Procesar unitario ----------
  procesarUnitario(data: any): Observable<any> {
    return this._httpClient.post(`${this.baseRecepcionUrl}ProcesarUnitario`, data);
  }

  // ---------- 📌 Eliminar unitario (DELETE físico) ----------
deleteProcesarUnitario(dto: { IdDocumentoRecepcion: number }): Observable<any> {
  return this._httpClient.request('delete', `${this.baseRecepcionUrl}Deleteprocesarunitario`, {
    body: dto
  });
}

  // ---------- 📌 Listar documentos ----------
  listarDocumentosRecepcion(fecini?: string, fecfin?: string, numeroordenservicio?: string): Observable<DocumentoRecepcion[]> {
    let params = new HttpParams();
    if (fecini) params = params.set('fecini', fecini);
    if (fecfin) params = params.set('fecfin', fecfin);
    if (numeroordenservicio) params = params.set('numeroordenservicio', numeroordenservicio);

    return this._httpClient.get<DocumentoRecepcion[]>(`${this.baseRecepcionUrl}listar`, { params });
  }

  // ---------- 📌 Otros endpoints de mantenimiento ----------
  getAllValorTabla(tablaId: number): Observable<any> {
    return this._httpClient.get(`${this.baseUrl}GetAllValorTabla?TablaId=${tablaId}`);
  }

  getClientes(): Observable<any> {
    return this._httpClient.get(`${this.baseUrl}GetClientes`);
  }

// Traer todas las sucursales
getSucursal(): Observable<any[]> {
  return this._httpClient.get<any[]>(`${this.baseUrl}GetSucursal`);
}
// Verificar duplicado de guía
verificarDuplicado(guia: string, idSucursal: number, idAlmacen: number) {
  const params = {
    guia: guia.trim(),
    idSucursal: idSucursal.toString(),
    idAlmacen: idAlmacen.toString()
  };
  return this._httpClient.get<boolean>(`${this.baseUrl}VerificarDuplicado`, { params });
}

// Traer sucursales por criterio
getSucursalxCriterio(codigo?: string, nombre?: string, idPartner?: number): Observable<any[]> {
  let params = new HttpParams()
    .set('codigo', codigo || '')
    .set('nombre', nombre || '')
    .set('idPartner', idPartner?.toString() || '');

  return this._httpClient.get<any[]>(`${this.baseUrl}GetSucursalxCriterio`, { params });
}



getAlmacenes(idSucursal: number): Observable<any[]> {
  return this._httpClient.get<any[]>(`${this.baseUrl}GetAlmacenes?IdSucursal=${idSucursal}`);
}

  getPartners(): Observable<any[]> {
    return this._httpClient.get<any[]>(`${this.baseUrl}GetPartnerxCriterio`);
  }

getProductos(codigo?: string): Observable<any> {
  if (codigo) {
    // 👉 Buscar por criterio si hay código
       return this._httpClient.get<any[]>(
      `${this.baseUrl}GetProductosxCriterio?codigo=${codigo}`
    );
  } else {
    // 👉 Si no hay código, traer todos
    return this._httpClient.get(`${this.baseUrl}GetProductos`);
  }
}
  getValoresTabla(IdMaestroTabla: number): Observable<any[]> {
    let params = new HttpParams().set('idMaestroTabla', String(IdMaestroTabla));
    return this._httpClient.get<any[]>(`${this.baseUrl}GetValoresTabla`, { params });
  }

  // ---------------------------
  // 📌 FABRICANTES
  // ---------------------------
  getFabricantes(): Observable<any[]> {
    return this._httpClient.get<any[]>(`${this.baseUrl}GetFabricantes`);
  }

  // ---------------------------
  // 📌 MODELOS
  // ---------------------------
  getModelos(): Observable<any[]> {
    return this._httpClient.get<any[]>(`${this.baseUrl}GetModelos`);
  }

}
