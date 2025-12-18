import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { Producto } from './inventario.types';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private _httpClient = inject(HttpClient);

  private mantenimientoUrl = `${environment.baseUrl}/api/Mantenimiento`;
  private inventarioUrl = `${environment.baseUrl}/api/Inventario`;
  private seguridadUrl = `${environment.baseUrl}/api/Seguridad`;


  // 🔹 LISTAR INVENTARIO
 listarInventario(filtro: any): Observable<any[]> {
  let params = new HttpParams();

  if (filtro.idAlmacen) params = params.set('idAlmacen', filtro.idAlmacen);
  if (filtro.idProducto) params = params.set('idProducto', filtro.idProducto);
  if (filtro.idEstado) params = params.set('idEstado', filtro.idEstado); // ✅ opcional
  if (filtro.serie) params = params.set('serie', filtro.serie.trim());
  if (filtro.imei) params = params.set('imei', filtro.imei.trim());

  return this._httpClient.get<any[]>(`${this.inventarioUrl}/ListarInventario`, { params });
}

  // 🔹 MODELOS
getModelos(): Observable<any[]> {
  return this._httpClient.get<any[]>(`${this.mantenimientoUrl}/GetModelos`);
}

  // 🔹 SUCURSALES
  getSucursales(): Observable<any[]> {
    return this._httpClient.get<any[]>(`${this.mantenimientoUrl}/GetSucursal`);
  }

  // 🔹 ALMACENES
  getAlmacenes(idSucursal: number): Observable<any[]> {
    return this._httpClient.get<any[]>(`${this.mantenimientoUrl}/GetAlmacenes?IdSucursal=${idSucursal}`);
  }

  // 🔹 PRODUCTOS
  getProductos(): Observable<Producto[]> {
    return this._httpClient.get<Producto[]>(`${this.mantenimientoUrl}/GetProductos`);
  }

  // 🔹 ESTADOS
  getEstados(idTabla: number): Observable<any[]> {
    const params = new HttpParams().set('IdTabla', idTabla.toString());
    return this._httpClient.get<any[]>(`${this.mantenimientoUrl}/GetEstados`, { params });
  }
  exportarInventario(filtros: any): void {
  const params = new URLSearchParams();

  if (filtros.idAlmacen) params.append('idAlmacen', filtros.idAlmacen);
  if (filtros.idProducto) params.append('idProducto', filtros.idProducto);
  if (filtros.idEstado) params.append('idEstado', filtros.idEstado);
  if (filtros.imei) params.append('imei', filtros.imei);
  if (filtros.serie) params.append('serie', filtros.serie);

  const url = `${this.inventarioUrl}/ExportarInventario?${params.toString()}`;

  // 🔹 Descarga directa del archivo Excel
  window.open(url, '_blank');
}

agregarInventarioManual(data: any) {
  return this._httpClient.post(`${this.mantenimientoUrl}/AgregarInventarioManual`, data);
}

actualizarCantidadPorProducto(idProducto: number, nuevaCantidad: number) {
  return this._httpClient.put(`${this.inventarioUrl}/ActualizarCantidadPorProducto`, null, {
    params: { idProducto, nuevaCantidad }
  });
}
getProductosPorAlmacen(idAlmacen: number) {
  return this._httpClient.get<any[]>(`${this.inventarioUrl}/GetProductosPorAlmacen`, {
    params: { idAlmacen }
  });
}


}
