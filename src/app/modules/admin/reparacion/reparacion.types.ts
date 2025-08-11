// src/app/models/reparacion-request.model.ts
export interface ReparacionRequest {
    idDiagnostico?: number;
    idReparacion?: number;
    idRepuesto?: number;
    idOrdenServicio?: number;
    idOttTiempo: number;
    idOrdenTrabajo: number;
  }
  export interface UsuarioDto {
  usr_int_id: number;
  nombreCompleto: string;
}
export interface CambiarTecnicoDto {
  idOrdenServicioTecnico: number;
  idTecnico: number;
}

export interface ListarOrdenTrabajoDetalleResult {
  descripcion: string;
  diagnostico: string;
  reparacion: string;
  repuestos: string;
  serie: string;
  imei: string;
  // Agrega aquí los demás campos si existen en el DTO
}
export interface FinalizarReparacionRequest {
  id: number;              // id de orden de trabajo
  idOtTiempo: number;      // id del tiempo activo
  descripcion: string;
  informeTecnico: string;
  idestado: number;
}
export interface AprobarQcDto {
  idOrdenServicio: number;
  aprobado: boolean;
}
export enum EstadoOT {
  Reparado = 44,
  Remozado = 43,
  Irreparable = 68
}
