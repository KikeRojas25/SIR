export interface Usuario {
  usr_int_id?: number;
  nombre: string;
  apellido: string;
  usuarioRed: string;
  correo: string;
  idSucursal?: number;
  usr_str_recordarpwd?: string;
  usr_int_cambiarpwd?: number;
  usr_int_bloqueado?: number;
  usr_int_aprobado?: number;
}
