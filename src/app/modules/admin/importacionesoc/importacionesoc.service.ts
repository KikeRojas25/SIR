import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { OCResult } from './importacionesoc.type';



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
export class ImportacionesocService {

private baseUrl = environment.baseUrl + '/api/ImportacionesOc/';
private _httpClient = inject(HttpClient);

  
constructor() { }




getRubros(): Observable<any[]> {
  return this._httpClient.get<any[]>(  `${this.baseUrl}Listar-Rubros`  , httpOptions);  
}

getFamilias(rubro: any): Observable<any[]> {
  return this._httpClient.get<any[]>(`${this.baseUrl}Listar-Familia/${rubro}`, httpOptions);
}

getSubfamilias(familia: any): Observable<any[]> {
  return this._httpClient.get<any[]>(`${this.baseUrl}Listar-SubFamilia/${familia}`, httpOptions);
}

getOcs(parametros: any): Observable<OCResult[]> {

  if(parametros.sku === ''){
    parametros.sku = null;
  }
  
  if(parametros.NumOrdenCompra === ''){
    parametros.NumOrdenCompra = null;
  }

  return this._httpClient.post<OCResult[]>(`${this.baseUrl}Listar-Ocs`, parametros , httpOptions);
}

getDetalleOC(numoc: any): Observable<any[]> {
  return this._httpClient.get<any[]>(`${this.baseUrl}Obtener-DetalleOC/${numoc}`, httpOptions);
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

getFiles(numoc:string)  {
  return this._httpClient.get<any[]>(`${this.baseUrl}Get-ArchivosPorOC/${numoc}`, httpOptions);
}

FinalizarEstado(parametros: any) {
  return this._httpClient.post<any>(`${this.baseUrl}NextWorkflow`, parametros , httpOptions);
}

IniciarEstado(  oc: any) {
  return this._httpClient.post<any>(`${this.baseUrl}NextWorkflow/${oc}`, null , httpOptions);
}




}
