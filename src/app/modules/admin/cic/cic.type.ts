
export interface DocumentoRecepcion {
  numerodocumento: string;
  documentocliente: string;
  dua: string;
  numerofacturacomercial: string;
  fechafacturacomercial: string;
  idtiporecibo: number;
  guiaremision: string;
  idfabricante: number;
  idpartner: number;
  idorigen: number;
  activo: boolean;
  fechahoraregistro: string;
  idusuarioregistro: number;
  idordenservicio: number;
  numeroGuia: string;
  idproducto: number;
  idalmacen: number;
  fechaRecepcion: string
  idcliente: number;
}

export interface DocumentoRecepcionDetalle {
  numeropallet: string;
  caja: string;
  repuesto: boolean ;
  idtipoproducto: number;
  fila: number;
  idproducto: number;
  serie: string;
  imei: string;
  idmodelo: number;
  mac: string;
  cantidad: number;
  fechahorapersonalizacion?: string;
  idusuariopersonalizacion?: number;
  idalmacen: number;
  codigoproducto?: string;
}
export interface RegistrarRecepcionDto {
  numeroDocumento: string;
  guiaRemision: string;
  fechaRecepcion: string;   // viene como string ISO
  idPartner: number;
  idFabricante: number;
  idProducto: number;
  idOrigen: number;
  idAlmacen: number;
  idUsuarioRegistro: number;
  serie: string;
  imei: string;
  mac: string;
  cantidad: number;
}

export interface RegistrarDeleteDto {
  idDocumentoRecepcion: number;
}
