import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { MaestroService } from '../maestro.service';

@Component({
  selector: 'app-diagnostico',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    ButtonModule,
    DropdownModule,
    TableModule,
    InputTextModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './diagnostico.component.html',
  styleUrls: ['./diagnostico.component.css'],
})
export class DiagnosticoComponent implements OnInit {

  diagnosticos: any[] = [];
  categorias: any[] = [];

  filtro = {
    idCategoriaReparacion: null as number | null
  };

  constructor(
    private maestroService: MaestroService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.cargarCombos();
    this.listarDiagnosticos();
  }

  // ======================================================
  // 🔍 BUSCAR  ← FALTABA ESTE MÉTODO
  // ======================================================
  buscar(): void {
    this.listarDiagnosticos();
  }

  // ======================================================
  // CARGA DE COMBOS
  // ======================================================
  cargarCombos(): void {
    this.maestroService.getCategoriasReparacion().subscribe({
      next: (res) => {
this.categorias = (res ?? []).map((c: any) => ({
  idCategoriaReparacion: c.idcategoriareparacion ?? c.idCategoriaReparacion ?? c.IdCategoriaReparacion,
  descripcion: c.descripcion ?? c.Descripcion
}));

      },
      error: () => console.warn('⚠️ Error al cargar categorías'),
    });
  }

  // ======================================================
  // LISTADO
  // ======================================================
  listarDiagnosticos(): void {
    this.maestroService.getDiagnosticoxCriterio(this.filtro).subscribe({

      
      next: (res) => {

   


        this.diagnosticos =
          res?.map((d: any) => ({
            iddiagnosticosmartway: d.iddiagnosticosmartway ?? d.iddiagnosticosmartway,
            codigoSmartway: d.codigoSmartway ?? d.CodigoSmartway,
            descripcion: d.descripcion ?? d.Descripcion,
            idCategoriaReparacion:
              d.idCategoriaReparacion ?? d.IdCategoriaReparacion,
            categoriaReparacion:
              d.categoriaReparacion ?? d.CategoriaReparacion,
            editando: false,
          })) || [];


               console.log("diagnosticos" ,  this.diagnosticos);

      },
      error: (err) => console.error('❌ Error al listar diagnósticos', err),
    });
  }

  // ======================================================
  // NUEVO
  // ======================================================
  nuevo(): void {
    const nuevo: any = {
      iddiagnosticosmartway: null,
      codigoSmartway: '',
      descripcion: '',
      idCategoriaReparacion: null,
      categoriaReparacion: '',
      editando: true,
    };
    this.diagnosticos.unshift(nuevo);
  }

  editar(row: any): void {
    row.editando = true;
  }

  cancelar(row: any, index: number): void {
    if (!row.idDiagnostico) {
      this.diagnosticos.splice(index, 1);
    } else {
      row.editando = false;
    }
  }

  // ======================================================
  // GUARDAR
  // ======================================================
  guardar(row: any): void {
    if (!row.codigoSmartway?.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'El código Smartway es obligatorio.',
        life: 2500,
      });
      return;
    }

    if (!row.descripcion?.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'La descripción es obligatoria.',
        life: 2500,
      });
      return;
    }

    if (!row.idCategoriaReparacion) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'Debe seleccionar una categoría de reparación.',
        life: 2500,
      });
      return;
    }

    const esNuevo = !row.iddiagnosticosmartway;

    this.confirmationService.confirm({
      message: esNuevo
        ? '¿Desea crear un nuevo diagnóstico?'
        : '¿Desea actualizar el diagnóstico?',
      header: esNuevo ? 'Confirmar creación' : 'Confirmar actualización',
      icon: 'pi pi-question-circle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        const payload = {
          iddiagnosticosmartway: row.iddiagnosticosmartway ?? 0,
          CodigoSmartway: row.codigoSmartway?.trim(),
          Descripcion: row.descripcion?.trim(),
          IdCategoriaReparacion: row.idCategoriaReparacion
        };

        console.log('📤 Enviando al backend:', payload);

        this.maestroService.guardarDiagnostico(payload).subscribe({
          next: (res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: res?.mensaje || '✅ Diagnóstico guardado correctamente',
              life: 2500,
            });
            this.listarDiagnosticos();
          },
          error: (err) => {
            console.error('❌ Error al guardar diagnóstico', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo guardar el diagnóstico.',
              life: 2500,
            });
          },
        });
      },
    });
  }

  // ======================================================
  // ELIMINAR
  // ======================================================
  eliminar(id: number | null): void {
    if (!id) return;

    this.confirmationService.confirm({
      message: '¿Desea eliminar este diagnóstico?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.maestroService.eliminarDiagnostico(id).subscribe({
          next: (res: any) => {
            this.messageService.add({
              severity: 'info',
              summary: 'Eliminado',
              detail: res?.mensaje || '🗑️ Diagnóstico eliminado correctamente',
              life: 2500,
            });
            this.listarDiagnosticos();
          },
          error: (err) => {
            console.error('❌ Error al eliminar diagnóstico', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar el diagnóstico.',
              life: 2500,
            });
          },
        });
      },
    });
  }
}
