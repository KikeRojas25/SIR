import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { DocumentoRecepcion, DocumentoRecepcionDetalle } from './cic.type';



const httpOptions = {
  headers: new HttpHeaders({
    Authorization : 'Bearer ' + localStorage.getItem('token'),
    'Content-Type' : 'application/json'
  }),
      responseType: 'blob' // Configura para recibir un archivo
  // , observe: 'body', reportProgress: true };
};
const httpOptionsUpload = {
  headers: new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }),
  responseType: 'blob' // Configura para recibir un archivo
};



@Injectable({
  providedIn: 'root'
})
export class CicService {

  private _httpClient = inject(HttpClient);
  private baseUrl = environment.baseUrl + '/api/mantenimiento/';
  private baseRecepcionUrl = environment.baseUrl + '/api/recepcion/';


constructor() { }

uploadFile(usrid: number, file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const httpOptionsUpload = {
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    })
  };

  // Aquí especificamos responseType en la llamada al método post
  return this._httpClient.post(`${this.baseRecepcionUrl}UploadFile?usrid=${usrid}`, formData, {
    ...httpOptionsUpload, // Desestructuramos httpOptionsUpload
  });
}


procesarMasivo(data: any): Observable<any> {
  return this._httpClient.post(`${this.baseRecepcionUrl}ProcesarMasivo`, data);
}

getAllValorTabla(tablaId: number): Observable<any> {
  return this._httpClient.get(`${this.baseUrl}GetAllValorTabla?TablaId=${tablaId}`);
}

getClientes(): Observable<any> {
  return this._httpClient.get(`${this.baseUrl}GetClientes`);
}

getSucursal(): Observable<any> {
  return this._httpClient.get(`${this.baseUrl}GetSucursal`);
}

getAlmacenes(idSucursal: number): Observable<any> {
  return this._httpClient.get(`${this.baseUrl}GetAlmacenes?IdSucursal=${idSucursal}`);
}

getParterns(): Observable<any> {
  return this._httpClient.get(`${this.baseUrl}GetPartners`);
}

getProductos(): Observable<any> {
  return this._httpClient.get(`${this.baseUrl}GetProductos`);
}


  listarDocumentosRecepcion(fecini?: string, fecfin?: string, numeroordenservicio?: string): Observable<DocumentoRecepcion[]> {
    let params = new HttpParams();
    if (fecini) params = params.set('fecini', fecini);
    if (fecfin) params = params.set('fecfin', fecfin);
    if (numeroordenservicio) params = params.set('numeroordenservicio', numeroordenservicio);

    return this._httpClient.get<DocumentoRecepcion[]>(`${this.baseRecepcionUrl}listar`, { params });
  }



insertarDocumentoRecepcion(payload: {
  documentoRecepcion: DocumentoRecepcion,
  detalles: DocumentoRecepcionDetalle[]
}): Observable<any> {

    return this._httpClient.post<number>(`${this.baseRecepcionUrl}procesarMasivo`, payload);
  }

}
