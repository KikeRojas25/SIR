import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { CheckboxModule } from 'primeng/checkbox';
import { InventarioService } from '../inventario.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-operacionesinventario',
  standalone: true,
  templateUrl: './operacionesinventario.component.html',
  styleUrls: ['./operacionesinventario.component.css'],
  imports: [
    FormsModule,
    CommonModule,
    MatIcon,
    CalendarModule,
    DropdownModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    CheckboxModule
  ],
  providers: [
    DialogService,
    MessageService,
    ConfirmationService,
    InventarioService
  ]
})
export class OperacionesinventarioComponent implements OnInit {

  // 🔵 AGREGADO: JWT Helper + UserId
  jwtHelper = new JwtHelperService();
  userId: number = 0;

  sucursales: any[] = [];
  almacenes: any[] = [];
  productos: any[] = [];
  estados: any[] = [];
  inventario: any[] = [];

  sucursalSeleccionada: number | null = null;
  almacenSeleccionado: number | null = null;
  productoSeleccionado: number | null = null;
  estadoSeleccionado: number | null = null;
  serie: string = '';
  imei: string = '';

  modalAgregarVisible: boolean = false;

  nuevoInventario: any = {
    idAlmacen: null,
    idProducto: null,
    cantidad: null,
    serie: '',
    imei: '',
    mac: ''
  };

  modalEditarVisible: boolean = false;

  inventarioEditar: any = {
    idProducto: null,
    cantidad: null
  };

  constructor(
    private inventarioService: InventarioService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {

    // 🔵 LEER TOKEN Y OBTENER ID USUARIO
    const token = localStorage.getItem('token');

    if (token) {
      const decoded: any = this.jwtHelper.decodeToken(token);
      this.userId = Number(decoded.nameid ?? decoded.sub ?? 0);
      console.log("Usuario logueado:", this.userId);
    }

    this.cargarSucursales();
    this.cargarProductos();
    this.cargarEstados();
  }

  cargarSucursales() {
    this.inventarioService.getSucursales().subscribe({
      next: (data) => {
        this.sucursales = data.map((x: any) => ({
          label: x.nombre ?? 'Sin nombre',
          value: x.idSucursal
        }));
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las sucursales.'
        });
      }
    });
  }

  cargarAlmacenes(idSucursal: number) {
    if (!idSucursal) {
      this.almacenes = [];
      return;
    }
    this.inventarioService.getAlmacenes(idSucursal).subscribe({
      next: (data) => {
        this.almacenes = data.map((x: any) => ({
          label: x.nombreAlmacen ?? 'Sin nombre',
          value: x.idAlmacen
        }));
      }
    });
  }

  cargarProductos() {
    this.inventarioService.getProductos().subscribe({
      next: (data: any[]) => {
        this.productos = data.map((x: any) => ({
          label: `${x.descripcionLarga ?? 'Sin descripción'} (${x.codigoProducto ?? ''})`,
          value: x.idProducto
        }));
      }
    });
  }

  cargarEstados() {
    const idTabla = 74;
    this.inventarioService.getEstados(idTabla).subscribe({
      next: (data: any[]) => {
        this.estados = data.map((x: any) => ({
          label: x.estado ?? 'Sin nombre',
          value: x.idestado
        }));
      }
    });
  }

  onSucursalChange(event: any) {
    const idSucursal = event?.value ?? null;
    this.sucursalSeleccionada = idSucursal;
    this.cargarAlmacenes(idSucursal);
  }

  limpiarCampo(campo: 'serie' | 'imei') {
    if (campo === 'serie') this.serie = '';
    if (campo === 'imei') this.imei = '';
  }

  buscarInventario() {
    const filtros = {
      idAlmacen: this.almacenSeleccionado,
      idProducto: this.productoSeleccionado,
      idEstado: this.estadoSeleccionado,
      imei: this.imei.trim(),
      serie: this.serie.trim()
    };

    this.inventarioService.listarInventario(filtros).subscribe({
      next: (data: any[]) => {


        console.log('Inventario recibido:', data);

        this.inventario = data.map((x: any) => ({
          idProducto: x.idproducto,
          codigo: x.codigoproducto ?? '',
          producto: x.descripcionlarga ?? '',
          modelo: x.modelo ?? '',
          serie: x.serie ?? '',
          imei: x.imei ?? '',
          repuesto: x.repuesto,
          estado: x.estado ?? '',
          cantidad: x.cantidad ?? 0
        }));

        if (this.inventario.length === 0) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Sin resultados',
            detail: 'No se encontraron productos en el inventario.'
          });
        }
      },
      error: (err) => {
        console.error('Error al listar inventario:', err);
        if (err.status >= 500 || err.status === 0) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Ocurrió un error al listar el inventario.'
          });
        }
      }
    });
  }

  exportar() {
    const filtros = {
      idAlmacen: this.almacenSeleccionado,
      idProducto: this.productoSeleccionado,
      idEstado: this.estadoSeleccionado,
      imei: this.imei.trim(),
      serie: this.serie.trim()
    };

    if (!this.almacenSeleccionado) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debes seleccionar al menos un almacén para exportar.'
      });
      return;
    }

    this.messageService.add({
      severity: 'info',
      summary: 'Exportación',
      detail: 'Generando archivo Excel...'
    });

    this.inventarioService.exportarInventario(filtros);
  }

  operar(item: any) {
    this.messageService.add({
      severity: 'info',
      summary: 'Operar',
      detail: `Operar con producto ${item.producto}`
    });
  }

  abrirModalAgregar() {
    this.modalAgregarVisible = true;
  }

  // 🔵 AHORA USA EL USERID REAL
  guardarInventario() {
    const payload = {
      idAlmacen: this.nuevoInventario.idAlmacen,
      idProducto: this.nuevoInventario.idProducto,
      cantidad: this.nuevoInventario.cantidad,
      serie: this.nuevoInventario.serie,
      imei: this.nuevoInventario.imei,
      mac: this.nuevoInventario.mac,
      idUsuario: this.userId   // ← YA NO ES 2, ES EL USUARIO LOGUEADO
    };

    this.inventarioService.agregarInventarioManual(payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Inventario agregado correctamente.'
        });
        this.modalAgregarVisible = false;
        this.buscarInventario();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo agregar el inventario.'
        });
      }
    });
  }

  editarInventario(item: any) {
    this.inventarioEditar = {
      idProducto: item.idProducto,
      cantidad: item.cantidad
    };

    this.modalEditarVisible = true;
  }

  guardarEdicion() {

  // 🔥 Validación en el FRONT
  if (this.inventarioEditar.repuesto === 'No') {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se puede actualizar la cantidad porque este registro corresponde a un PRODUCTO, no a un repuesto.'
    });
    return; // ⛔ No llama al backend
  }

  // Si sí es repuesto → actualizar normalmente
  this.inventarioService.actualizarCantidadPorProducto(
    this.inventarioEditar.idProducto,
    this.inventarioEditar.cantidad
  ).subscribe({
    next: () => {
      this.messageService.add({
        severity: 'success',
        summary: 'Actualizado',
        detail: 'Cantidad actualizada correctamente.'
      });
      this.modalEditarVisible = false;
      this.buscarInventario();
    },
   error: (err) => {
  const backendMessage =
    err?.error?.message ||
    "No se pudo actualizar la cantidad porque es un Producto";

  this.messageService.add({
    severity: 'error',
    summary: 'Error',
    detail: backendMessage
  });

    }
    });
  }

}
