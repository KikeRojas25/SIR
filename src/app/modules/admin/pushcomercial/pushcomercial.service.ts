import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';



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
export class PushcomercialService {

private baseUrl = environment.baseUrl + '/api/ImportacionesOc/';
private _httpClient = inject(HttpClient);


constructor() { }



getPushComercial(fecini: string, fecfin: string, acotado: number | null, sku: string): Observable<any[]> {
  // Construir la URL con los parámetros necesarios
  const url = `${this.baseUrl}GetPushComercial?fecini=${fecini}&fecfin=${fecfin}&acotado=${acotado ?? ''}&sku=${sku}`;
  
  // Realizar la llamada GET al API con los parámetros
  return this._httpClient.get<any[]>(url, httpOptions);
}


}