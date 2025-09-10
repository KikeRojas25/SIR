import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { Producto } from '../maestro.types';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MaestroService } from '../maestro.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIcon,
    InputTextModule,
    ButtonModule,
    TableModule,
    DialogModule,
    DropdownModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService]
})
export class ProductoComponent implements OnInit {
  productos: Producto[] = [];

  filtro: any = {
    codigo: '',
    descripcion: '',
    idTipoProducto: null,
    idFabricante: null,
    idModelo: null,
    repuesto: null
  };

  tipos: any[] = [];
  fabricantes: any[] = [];
  modelos: any[] = [];
  familias: any[] = [];
  tiposMercaderia: any[] = []; // 👈 nuevo combo

  dialogNuevo: boolean = false;
  modoEdicion: boolean = false;

  nuevoProducto: any = {
    IdProducto: null,
    CodigoProducto: '',
    DescripcionCorta: '',
    DescripcionLarga: '',
    Repuesto: false,
    IdTipoProducto: null,
    IdFabricante: null,
    IdModelo: null,
    IdFamilia: null,
    IdTipoMercaderia: null, // 👈 agregado
    Peso: 0,
    StockMaximo: 0,
    Volumen: 0,
    IdMoneda: 1,
    PrecioUnitario: 0,
    Activo: true
  };

  constructor(
    private maestroService: MaestroService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.cargarCombos();
    this.buscar();
  }

  cargarCombos(): void {
    // Tipos de producto
    this.maestroService.getTiposProducto().subscribe({
      next: (data) => {
        this.tipos = [{ label: '--Todos--', value: null }];
        this.tipos.push(
          ...data.map((t: any) => ({
            label: t.descripcion,
            value: t.id
          }))
        );
      }
    });

    // Fabricantes
    this.maestroService.getFabricantes().subscribe({
      next: (data) => {
        this.fabricantes = [
          { label: '--Todos--', value: null },
          ...data.map((f) => ({
            label: f.razonSocial,
            value: f.idPartner
          }))
        ];
      }
    });

    // Familias (tabla 52)
    this.maestroService.getValoresTabla(52).subscribe({
      next: (data) => {
        this.familias = data.map((f: any) => ({
          label: f.valor,
          value: f.idValorTabla
        }));
      }
    });

    // Modelos
    this.maestroService.getModelos().subscribe({
      next: (data) => {
        this.modelos = [{ label: '--Todos--', value: null }];
        this.modelos.push(
          ...data.map((m: any) => ({
            label: m.valor,
            value: m.idValorTabla
          }))
        );
      }
    });

    // Tipo Mercadería (tabla 31)
    this.maestroService.getValoresTabla(31).subscribe({
      next: (data) => {
        this.tiposMercaderia = data.map((t: any) => ({
          label: t.valor,
          value: t.idValorTabla
        }));
      },
      error: (err) => console.error('❌ Error cargando tipos de mercadería', err)
    });
  }

  buscar(): void {
    this.maestroService.getProductosxCriterio(this.filtro).subscribe({
      next: (data) => (this.productos = data),
      error: (err) => console.error('❌ Error en búsqueda', err)
    });
  }

  editar(prod: any): void {
    this.modoEdicion = true;

    this.nuevoProducto = {
      IdProducto: prod.idProducto,
      CodigoProducto: prod.codigoProducto,
      DescripcionCorta: prod.descripcionCorta,
      DescripcionLarga: prod.descripcionLarga,
      Repuesto: prod.repuesto,
      IdTipoProducto: prod.idTipoProducto,
      IdFabricante: prod.idFabricante,
      IdModelo: prod.idModelo,
      IdFamilia: prod.idFamilia,
      IdTipoMercaderia: prod.idTipoMercaderia, // 👈 agregado
      Peso: prod.peso,
      StockMaximo: prod.stockMaximo,
      Volumen: prod.volumen,
      IdMoneda: prod.idMoneda,
      PrecioUnitario: prod.precioUnitario,
      Activo: prod.activo
    };

    this.dialogNuevo = true;
  }

  eliminar(id: number): void {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar este producto?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.maestroService.eliminarProducto(id).subscribe({
          next: () => {
            this.buscar();
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: '✅ Producto eliminado correctamente'
            });
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error
            });
          }
        });
      }
    });
  }

  abrirDialogoNuevo() {
    this.modoEdicion = false;
    this.nuevoProducto = {
      IdProducto: null,
      CodigoProducto: '',
      DescripcionCorta: '',
      DescripcionLarga: '',
      Repuesto: false,
      IdTipoProducto: null,
      IdFabricante: null,
      IdModelo: null,
      IdFamilia: null,
      IdTipoMercaderia: null,
      Peso: 0,
      StockMaximo: 0,
      Volumen: 0,
      IdMoneda: 1,
      PrecioUnitario: 0,
      Activo: true
    };
    this.dialogNuevo = true;
  }

  confirmarGuardar() {
    const accion = this.modoEdicion ? 'actualizar' : 'agregar';
    this.confirmationService.confirm({
      message: `¿Está seguro de que desea ${accion} este producto?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.modoEdicion ? this.actualizarProducto() : this.guardarNuevo();
      }
    });
  }

  guardarNuevo() {
    const dto: any = {
      CodigoProducto: this.nuevoProducto.CodigoProducto.trim(),
      DescripcionCorta: this.nuevoProducto.DescripcionCorta?.trim() || '',
      DescripcionLarga: this.nuevoProducto.DescripcionLarga?.trim() || null,
      Repuesto: Boolean(this.nuevoProducto.Repuesto),
      IdTipoProducto: Number(this.nuevoProducto.IdTipoProducto),
      IdFabricante: Number(this.nuevoProducto.IdFabricante),
      IdModelo: Number(this.nuevoProducto.IdModelo),
      IdFamilia: this.nuevoProducto.IdFamilia ? Number(this.nuevoProducto.IdFamilia) : null,
      IdTipoMercaderia: this.nuevoProducto.IdTipoMercaderia ? Number(this.nuevoProducto.IdTipoMercaderia) : null, // 👈 agregado
      Peso: Number(this.nuevoProducto.Peso) || 0,
      StockMaximo: Number(this.nuevoProducto.StockMaximo) || 0,
      Volumen: Number(this.nuevoProducto.Volumen) || 0,
      IdMoneda: Number(this.nuevoProducto.IdMoneda) || 1,
      PrecioUnitario: Number(this.nuevoProducto.PrecioUnitario) || 0,
      Activo: true
    };

    if (this.modoEdicion && this.nuevoProducto.IdProducto) {
      dto.IdProducto = this.nuevoProducto.IdProducto;
    }

    const request = this.modoEdicion
      ? this.maestroService.actualizarProducto(dto)
      : this.maestroService.registrarProducto(dto);

    request.subscribe({
      next: () => {
        this.dialogNuevo = false;
        this.buscar();
        this.modoEdicion = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: this.modoEdicion
            ? '✅ Producto actualizado correctamente'
            : '✅ Producto registrado con éxito'
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error
        });
      }
    });
  }

  actualizarProducto() {
    this.guardarNuevo(); // 👈 reutilizamos lógica
  }
  limpiarCampo(campo: string): void {
  if (campo in this.filtro) {
    this.filtro[campo] = '';
    this.buscar();  // vuelve a ejecutar la búsqueda sin ese filtro
  }
}

}
