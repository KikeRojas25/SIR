import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Cliente, Partner, ValorTabla,Producto } from './maestro.types';

@Injectable({ providedIn: 'root' })
export class MaestroService {
  private _httpClient = inject(HttpClient);
  // Evita doble /mantenimiento en las rutas de abajo
  private baseUrl = `${environment.baseUrl}/api/Mantenimiento`;

  // ---------------------------
  // 📌 CLIENTE
  // ---------------------------
  buscarClientes(criterio: string): Observable<Cliente[]> {
    const params = new HttpParams().set('cliente', criterio ?? '');
    return this._httpClient.get<Cliente[]>(`${this.baseUrl}/GetClientesxCriterio`, { params });
  }

  registrarCliente(cliente: Cliente): Observable<any> {
    return this._httpClient.post(`${this.baseUrl}/RegistrarCliente`, cliente);
  }

  actualizarCliente(cliente: Cliente): Observable<any> {
    return this._httpClient.put(`${this.baseUrl}/ActualizarCliente`, cliente);
  }

  eliminarCliente(idCliente: number): Observable<any> {
    return this._httpClient.delete(`${this.baseUrl}/DeleteCliente`, {
      body: { idCliente }
    });
  }

  // ---------------------------
  // 📌 PARTNER
  // ---------------------------
  getPartners(ruc?: string, razon?: string): Observable<Partner[]> {
    const params = new HttpParams()
      .set('ruc', ruc || '')
      .set('razon', razon || '');
    return this._httpClient.get<Partner[]>(`${this.baseUrl}/GetPartnerxCriterio`, { params });
  }

registrarPartner(partner: Partner): Observable<any> {
  // 🚀 Manda camelCase como lo espera el backend
  console.log("📤 Enviando al backend:", partner);
  return this._httpClient.post(`${this.baseUrl}/RegistrarPartner`, partner);
}


  actualizarPartner(partner: Partner): Observable<any> {
    return this._httpClient.put(`${this.baseUrl}/ActualizarPartner`, partner);
  }

  eliminarPartner(idPartner: number): Observable<any> {
    return this._httpClient.delete(`${this.baseUrl}/DeletePartner`, {
      body: { idPartner }
    });
  }

  // ---------------------------
  // 📌 VALORES TABLA (GENÉRICO)
  // ---------------------------
  getValoresTabla(idMaestroTabla: number): Observable<ValorTabla[]> {
    const params = new HttpParams().set('idMaestroTabla', String(idMaestroTabla));
    return this._httpClient.get<ValorTabla[]>(`${this.baseUrl}/GetValoresTabla`, { params });
    // si el endpoint es otra ruta, ajusta solo esta línea
  }
  // ---------------------------
// ---------------------------
// 📌 PRODUCTO
// ---------------------------
getProductos(): Observable<Producto[]> {
  return this._httpClient.get<Producto[]>(`${this.baseUrl}/GetProductos`);
}

getProductosxCriterio(filtro: any): Observable<Producto[]> {
  let params = new HttpParams()
    .set('codigo', filtro.codigo ?? '')
    .set('idTipoProducto', filtro.idTipoProducto ?? '')
    .set('descripcion', filtro.descripcion ?? '')
    .set('idFabricante', filtro.idFabricante ?? '')
    .set('idModelo', filtro.idModelo ?? '')
    .set('repuesto', filtro.repuesto ?? '');

  return this._httpClient.get<Producto[]>(`${this.baseUrl}/GetProductosxCriterio`, { params });
}

registrarProducto(producto: any): Observable<any> {
  return this._httpClient.post(`${this.baseUrl}/RegistrarProducto`, producto);
}

actualizarProducto(producto: Producto): Observable<any> {
  return this._httpClient.put(`${this.baseUrl}/ActualizarProducto`, producto);
}

eliminarProducto(idProducto: number): Observable<any> {
  return this._httpClient.delete(`${this.baseUrl}/DeleteProducto`, {
    body: { idProducto }
  });
}


getTiposProducto(): Observable<any[]> {
  return this._httpClient.get<any[]>(`${this.baseUrl}/GetTiposProducto`);
}

getFabricantes(): Observable<any[]> {
  return this._httpClient.get<any[]>(`${this.baseUrl}/GetFabricantes`);
}

getModelos(): Observable<any[]> {
  return this._httpClient.get<any[]>(`${this.baseUrl}/GetModelos`);
}
}