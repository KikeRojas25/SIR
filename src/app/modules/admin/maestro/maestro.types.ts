export interface Cliente {
  idCliente?: number;
  idTipoDocumento?: number;   // ✅ lo que se guarda
  tipoDocumento?: string;     // ✅ solo para mostrar en la tabla
  nombre: string;
  numeroDocumento: string;
  celular?: string;
  telefono?: string;
  email: string;
  activo?: boolean;
}



// DTO Partner (igual al backend)
export interface Partner {
  idPartner: number;
  idTipoPartner: number;
  razonSocial: string;
  nombreCorto: string;
  idTipoDocumento: number;
  numeroDocumento: string;
  contacto: string;
  telefono: string;
  celular: string;
  email: string;
  idMoneda: number;
  lineaCredito: number;
  lineaConsumida: number;
  idCondicionEntrega: number;
  idCondicionRecojo: number;
  idCondicionPago: number;
  idDireccion: number;
  activo: boolean;

  // extras que trae el SP (JOIN)
  tipoPartner?: string;
  condicionPago?: string;
  direccion?: string;
}

// ValorTabla (catálogo)
export interface ValorTabla {
  idValorTabla: number;
  valor: string;
  idMaestroTabla: number;
  activo: boolean;
  orden: number;
}
// ---------------------------
// 📌 PRODUCTO
// ---------------------------
export interface Producto {
  IdProducto: number | null;      // 👈 agregado para edición
  CodigoProducto: string;
  DescripcionCorta: string;
  DescripcionLarga?: string | null;
  Repuesto: boolean;
  IdTipoProducto: number | null;
  IdFabricante: number | null;
  IdModelo: number | null;
  IdFamilia: number | null;
  Peso: number;
  StockMaximo: number;
  Volumen: number;
  IdMoneda: number;
  PrecioUnitario: number;
  Activo: boolean;
  // Extras del SP (JOINs)
  tipoProducto?: string;
  fabricante?: string;
  modelo?: string;
}
