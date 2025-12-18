import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { DialogService } from 'primeng/dynamicdialog';
import { CicService } from '../cic.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-recepcionxguia',
  templateUrl: './recepcionxguia.component.html',
  styleUrls: ['./recepcionxguia.component.css'],
  standalone: true,
  imports: [
    FormsModule, CommonModule, MatIcon,
    CalendarModule, DropdownModule, InputTextModule,
    ButtonModule, TableModule, DialogModule, ToastModule,
    ConfirmDialogModule
  ],
  providers: [DialogService, MessageService, ConfirmationService]
})
export class RecepcionxguiaComponent implements OnInit {

  // Modelo del formulario (todo camelCase)
  formData: any = {
    codigoProducto: '',
    descripcion: '',
    serie: '',
    idProducto: 0,
  guiaRemision: '',    
    idCliente: null,
    idPartner: null,
    idFabricante: null,
    idOrigen: null,
    idSucursal: null,
    idAlmacen: null,
    fechaRecepcion: new Date()
  };

  clientes: any[] = [];
  partners: any[] = [];
  fabricantes: any[] = [];
  origenes: any[] = [];
  sucursales: any[] = [];
  almacenes: any[] = [];

  constructor(
    private cicService: CicService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.cargarCombos();
  }

cargarCombos(): void {
  this.cicService.getClientes().subscribe(res => {
    this.clientes = (res || []).map((x:any) => ({
      label: x.nombre ?? x.Nombre,
      value: x.idCliente ?? x.IdCliente
    }));
  });

  this.cicService.getPartners().subscribe(res => {
    this.partners = (res || []).map((x:any) => ({
      label: x.razonSocial ?? x.RazonSocial,
      value: x.idPartner ?? x.IdPartner
    }));
  });

  this.cicService.getFabricantes().subscribe(res => {
    this.fabricantes = (res || []).map((x:any) => ({
      label: x.razonSocial ?? x.RazonSocial,
      // toma el que exista: idFabricante primero, si no, idPartner
      value: x.idFabricante ?? x.IdFabricante ?? x.idPartner ?? x.IdPartner
    }));
  });

  this.cicService.getSucursal().subscribe(res => {
    this.sucursales = (res || []).map((x:any) => ({
      label: x.nombre ?? x.Nombre,
      value: x.idSucursal ?? x.IdSucursal
    }));
  });

  this.cicService.getAllValorTabla(34).subscribe(res => {
    this.origenes = (res || []).map((x:any) => ({
      label: x.valor ?? x.nombre ?? x.Nombre,
      value: x.idValorTabla ?? x.idorigen ?? x.IdOrigen
    }));
  });
}

  cargarAlmacenes(idSucursal: number): void {
    if (!idSucursal) { this.almacenes = []; return; }
    this.cicService.getAlmacenes(idSucursal).subscribe(res => this.almacenes = res || []);
  }

  // Buscar producto por código
  // Buscar producto por código (sin importar mayúsculas/minúsculas)
buscarProducto(): void {
  if (!this.formData.codigoProducto) { return; }

  const codigo = this.formData.codigoProducto.trim().toUpperCase(); // 👈 normaliza el input

  this.cicService.getProductos(codigo).subscribe({
    next: (result: any[]) => {
      const prod = (result || []).find(
        p => (p.codigoProducto ?? '').toUpperCase() === codigo // 👈 compara en mayúsculas
      );

      if (prod) {
        this.formData.descripcion = prod.descripcionCorta || 'Sin descripción';
        this.formData.idProducto = prod.idProducto || 0;
      } else {
        this.formData.descripcion = '---';
        this.formData.idProducto = 0;
        this.messageService.add({ severity: 'warn', summary: 'Aviso', detail: 'Código no encontrado' });
      }
    },
    error: () => {
      this.formData.descripcion = '---';
      this.formData.idProducto = 0;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al buscar producto' });
    }
  });
}

  // Guardar recepción (DTO completo)
  guardar(): void {
  // 1) Obtener IdUsuarioRegistro del JWT
  const token = localStorage.getItem('token');
  const decoded: any = token ? new JwtHelperService().decodeToken(token) : {};
  const idUsuario = Number(decoded.nameid ?? decoded.sub ?? 0);

  // 2) Validación rápida (agrega guía)
const faltan: string[] = [];
if (!this.formData.idProducto)    faltan.push('Código Producto válido');
if (!this.formData.serie?.trim()) faltan.push('Serie');
if (!this.formData.idPartner)     faltan.push('Partner');
if (!this.formData.idFabricante)  faltan.push('Fabricante');
if (!this.formData.idOrigen)      faltan.push('Origen');
if (!this.formData.idAlmacen)     faltan.push('Almacén');
if (!this.formData.guiaRemision?.trim()) faltan.push('Guía de Remisión'); // 👈 nuevo
if (faltan.length) {
  this.messageService.add({severity:'warn', summary:'Campos requeridos', detail:`Completa: ${faltan.join(', ')}`});
  return;
}

// 3) Fecha ISO
const toIso = (d: any) => new Date(d).toISOString();

// 4) DTO (sin nulls en cabecera y con IDs numéricos)
const dto = {
  NumeroDocumento: 'AUTO',                               
  GuiaRemision:    this.formData.guiaRemision,            
  IdUsuarioRegistro: idUsuario,
  IdPartner:     Number(this.formData.idPartner),
  IdFabricante:  Number(this.formData.idFabricante),
  IdOrigen:      Number(this.formData.idOrigen),
  IdProducto:    Number(this.formData.idProducto),
  IdSucursal:    Number(this.formData.idSucursal),  // ✅ AGREGA ESTA LÍNEA
  IdAlmacen:     Number(this.formData.idAlmacen),

  Serie: this.formData.serie,
  IMEI:  this.formData.imei ?? '',
  MAC:   this.formData.mac  ?? '',
  Cantidad: 1,                                            
  FechaRecepcion: toIso(this.formData.fechaRecepcion)
};

  console.log('DTO ProcesarUnitario →', dto);

  this.cicService.procesarUnitario(dto).subscribe({
    next: () => {
      this.messageService.add({ severity:'success', summary:'Éxito', detail:'Recepción registrada con éxito' });
      const keepDate = this.formData.fechaRecepcion;
      this.formData = {
        codigoProducto:'', descripcion:'', serie:'', idProducto:0,
        idCliente:null, idPartner:null, idFabricante:null, idOrigen:null,
        idSucursal:null, idAlmacen:null, fechaRecepcion: keepDate,
        imei:null, mac:null
      };
    },
   error: (e) => {
  console.error('procesarUnitario error', e);

  const msg = e?.error?.message || 'Error al guardar la recepción';
  const severity = e.status === 409 ? 'warn' : 'error';

  this.messageService.add({
    severity,
    summary: severity === 'warn' ? 'Advertencia' : 'Error',
    detail: msg
  });
}

  });
}

  // Eliminar recepción (ajusta el id real)
  eliminar(): void {
    const dto = { IdDocumentoRecepcion: 1 };
    this.cicService.deleteProcesarUnitario(dto).subscribe({
      next: () => this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Recepción eliminada con éxito' }),
      error: (e) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar la recepción' });
        console.error('deleteProcesarUnitario error', e);
      }
    });
  }
  // 🔎 Verifica si la guía ya existe (por sucursal + almacén)
verificarGuia(): void {
  const { guiaRemision, idSucursal, idAlmacen } = this.formData;

  if (!guiaRemision?.trim() || !idSucursal || !idAlmacen) {
    return;
  }

  this.cicService.verificarDuplicado(guiaRemision, idSucursal, idAlmacen).subscribe({
    next: (existe) => {
      if (existe === true) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Guía duplicada',
          detail: 'Ya existe una guía con este número en la sucursal y almacén seleccionados.'
        });
        this.formData.guiaRemision = '';
      }
    },
    error: () => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo verificar la guía, intente nuevamente.'
      });
    }
  });
}

}
