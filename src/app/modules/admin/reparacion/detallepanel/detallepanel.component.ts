import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MessageService, ConfirmationService, SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { PanelModule } from 'primeng/panel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ReparacionService } from '../reparacion.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { EstadoOT, FinalizarReparacionRequest } from '../reparacion.types';
import { concatMap, finalize, tap } from 'rxjs';


@Component({
  selector: 'app-detallepanel',
  templateUrl: './detallepanel.component.html',
  styleUrls: ['./detallepanel.component.css'],
     standalone: true,
      imports:[
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
        PanelModule,
        InputTextareaModule
    
      ],
      providers: [
        DialogService,
        MessageService ,
        ConfirmationService
        ]
})
export class DetallepanelComponent implements OnInit {

  diagnosticos : DiagnosticoItem[] = [];
  model: any = {};
  reparaciones: SelectItem[] = [];
  repuestos:  SelectItem[] = [];
  antecedentes: any[] = [];
  mostrarDialogAntecedentes = false;
ordenServicio: any = {};
    cargando = false;

    controlesBloqueados = false;


  contador: any = { dias: 0, horas: 0, minutos: 0, segundos: 0 };
  intervalRef: any;
  estaFinalizada = false;        // ← flag local para bloquear acciones

  id: any;
  detalles: any = [];
  numeroOSTFormateado: string = '';

  constructor(private reparacionService: ReparacionService,
    private confirmationService: ConfirmationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
   ) { }

  ngOnInit() {


    this.id  = this.activatedRoute.snapshot.params['uid'];
    this.cargarCombos();
    this.cargarContador(this.id); 
    this.numeroOSTFormateado = this.id.toString().padStart(10, '0');

    this.cargarOrdenTrabajoDetalle();


      this.reparacionService.obtenerOrdenServicio(this.id).subscribe({
    next: (data) => {
      console.log('✅ Orden de servicio obtenida:', data);
      this.model.descripcion = data.informeTecnico;  // 👈 por ejemplo, llenar tu caja de texto
      this.ordenServicio = data;               // 👈 guardar el objeto completo si lo necesitas
    },
    error: (err) => {
      console.error('❌ Error al obtener la orden de servicio:', err);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo cargar la información de la orden de servicio.'
      });
    }
  });


    // this.reparacionService.obtenerEstadoOT(this.id).subscribe(e => this.estaFinalizada = e.finalizada);
  }
  
  
  cargarCombos() {

    this.reparacionService.listarDiagnosticos().subscribe(response => {

      response.forEach(x=> {
        this.diagnosticos.push({ value : x.idDiagnostico , label: x.descripcion, data: x.idCategoriaReparacion })
      })
    })

  }

cargarOrdenTrabajoDetalle() {
 this.reparacionService.listarOrdenTrabajoDetalle(this.id).subscribe({
    next: (data) => {
      this.detalles = data;

     
    },
    error: (err) => console.error('❌ Error al cargar detalles de orden de trabajo:', err)
  });
}

  
cargarContador(id: number): void {
  this.reparacionService.getTiempoOrdenTrabajo(id).subscribe((res) => {

    if (!res || res.length === 0) {
      return;
    }

    const ultimo = res[0];

    const inicio = new Date(ultimo.fechaHoraInicio);

    // 🔑 Punto base:
    // - si estaba pausado → usar fechaHoraFin
    // - si estaba activo → usar ahora
    const base = ultimo.fechaHoraFin
      ? new Date(ultimo.fechaHoraFin)
      : new Date();

    // 1️⃣ Mostrar tiempo correcto
    this.calcularContador(inicio, base);

    // 2️⃣ 🔁 CONTINUAR SIEMPRE
    this.iniciarIntervalo(inicio);
  });
}

calcularContador(inicio: Date, fin: Date): void {
  const diffMs = fin.getTime() - inicio.getTime();
  const diffSeg = Math.floor(diffMs / 1000);

  this.contador.dias = Math.floor(diffSeg / (3600 * 24));
  this.contador.horas = Math.floor((diffSeg % (3600 * 24)) / 3600);
  this.contador.minutos = Math.floor((diffSeg % 3600) / 60);
  this.contador.segundos = diffSeg % 60;
}


iniciarIntervalo(inicio: Date): void {
  if (this.intervalRef) {
    clearInterval(this.intervalRef);
  }

  this.intervalRef = setInterval(() => {
    this.calcularContador(inicio, new Date());
  }, 1000);
}



  onDiagnosticoChange(event: any) {

    

    const idSeleccionado = event.value;

    const diagnosticoSeleccionado = this.diagnosticos.find(d => d.value === idSeleccionado);

    console.log('diagnosticoSeleccionado',diagnosticoSeleccionado);

    if (diagnosticoSeleccionado && diagnosticoSeleccionado.data) {
        const idCategoriaReparacion = diagnosticoSeleccionado.data;
        this.cargarReparaciones(idCategoriaReparacion);
    } else {
        this.reparaciones = []; // Limpia si no hay nada seleccionado o hay un error
    }
}

onReparacionChange(event: any) {




  const idSeleccionado = event.value;

  console.log(idSeleccionado,'entre');

  const reparacionSeleccinada = this.reparaciones.find(d => d.value === idSeleccionado);

  console.log('diagnosticoSeleccionado',reparacionSeleccinada);

  if (reparacionSeleccinada ) {
      const idCategoriaReparacion = reparacionSeleccinada.value;
      this.cargarRepuestos(idCategoriaReparacion);
  } else {
      this.reparaciones = []; // Limpia si no hay nada seleccionado o hay un error
  }
}
cargarRepuestos(IdReparacion: number) {

  
  this.reparacionService.listarRepuestos(this.id , IdReparacion).subscribe(response => {
    
    response.forEach(x=> {
      this.repuestos.push({ value : x.idProducto , label: x.descripcionLarga })
    })


  });
}
cargarReparaciones(idCategoriaReparacion: number) {
  // Limpia el array ANTES de llenar
  this.reparaciones = [];
  this.model.idreparacion = null;

  if (!idCategoriaReparacion) {
    console.warn('❌ No se recibió un id de categoría válido.');
    return;
  }

  this.reparacionService.listarReparacionesPorCategoria(idCategoriaReparacion).subscribe({
    next: (response) => {
      if (!response || response.length === 0) {
        console.info('ℹ️ No se encontraron reparaciones para esta categoría.');
        return;
      }

      // Llenamos el array solo si hay datos
      this.reparaciones = response.map(x => ({
        value: x.idReparacion,
        label: x.descripcion
      }));
    },
    error: (err) => {
      console.error('❌ Error al cargar reparaciones:', err);
    }
  });
}
agregarDetalle() {
  this.model.IdOrdenServicio = this.id;

  this.confirmationService.confirm({
    acceptLabel: 'Agregar',
    rejectLabel: 'Cancelar',
    acceptIcon: 'pi pi-check',
    rejectIcon: 'pi pi-times',
    message: '¿Está seguro que desea agregar el detalle a la reparación?',
    header: 'Confirmar',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      this.reparacionService.agregarReparacion(this.model).subscribe({
        next: (res: any) => {
          console.log('Respuesta del servidor:', res);

          if (res.res === false) {
            // ⚠️ Caso: backend devolvió res=false
            this.messageService.add({
              severity: 'warn',
              summary: 'Aviso',
              detail: res.msj || 'No se pudo agregar el detalle.'
            });
          } else {
            // ✅ Caso exitoso
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: res.msj || 'Se ha agregado correctamente.'
            });
            this.cargarOrdenTrabajoDetalle();
          }
        },
        error: (err) => {
          console.error('Error en la solicitud:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se ha podido agregar el detalle. Intente nuevamente.'
          });
        }
      });
    },
    reject: () => {}
  });
}

finalizarReparacion(): void {
  this.confirmationService.confirm({
    message: '¿Está seguro que desea finalizar esta reparación?',
    header: 'Finalizar reparación',
    icon: 'pi pi-check',
    acceptLabel: 'Sí',
    rejectLabel: 'No',
    accept: () => {
      const request: FinalizarReparacionRequest = {
        Id: this.id, // ID de la orden de trabajo
        IdOtTiempo: 0, // Debes tenerlo en el componente
        Descripcion: this.model.descripcion || '',
        InformeTecnico: this.model.informetecnico || '',
        IdEstado: EstadoOT.Reparado // Asignar el estado de reparado
      };

      this.reparacionService.finalizarReparacion(request).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Finalizado',
            detail: 'La reparación se finalizó correctamente.'
          });

          clearInterval(this.intervalRef); // Detener contador
          this.contador = { dias: 0, horas: 0, minutos: 0, segundos: 0 };

          // Opcional: refrescar detalles o redirigir
          this.cargarOrdenTrabajoDetalle();

          

        },
        error: (err) => {
          console.error('❌ Error al finalizar reparación:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo finalizar la reparación.'
          });
        }
      });
    }
  });
}

eliminarDetalle(detalle: any) {

  console.log('Eliminando detalle:', detalle.idordentrabajodetalle);

  this.confirmationService.confirm({
    message: '¿Está seguro de eliminar este detalle?',
    header: 'Eliminar detalle',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Sí',
    rejectLabel: 'No',
    accept: () => {
      this.reparacionService.eliminarDetalleReparacion(detalle.idordentrabajodetalle).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Detalle eliminado correctamente' });
          this.detalles = this.detalles.filter(d => d.idordentrabajodetalle !== detalle.idordentrabajodetalle); // Remover localmente
        },
        error: (err) => {
          console.error('❌ Error al eliminar detalle:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el detalle' });
        }
      });
    }
  });
}


confirmarPausaReparacion() {
  this.confirmationService.confirm({
    message: '¿Desea marcar esta reparación como pendiente por repuesto?',
    header: 'Confirmar pausa',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Sí',
    rejectLabel: 'No',
    accept: () => this.pausarReparacion()
  });
}

pausarReparacion() {
  this.reparacionService
    .pausarReparacion(this.id, this.model.descripcion)
    .subscribe({
      next: () => {

        // ⛔ detener reloj
        if (this.intervalRef) {
          clearInterval(this.intervalRef);
          this.intervalRef = null;
        }

        // ❌ NO REINICIAR CONTADOR

        this.messageService.add({
          severity: 'info',
          summary: 'Reparación pausada',
          detail: 'La orden fue pausada correctamente.'
        });

        // ⬅️ volver
setTimeout(() => {
  this.router.navigate(['/reparacion/panel']);
}, 600);

      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err?.error?.message || 'No se pudo pausar.'
        });
      }
    });
}


confirmarRemozado() {
  this.confirmationService.confirm({
    message: '¿Estás seguro de que deseas marcar este producto como remozado?',
    header: 'Confirmar remozado',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Sí, marcar',
    rejectLabel: 'Cancelar',
    accept: () => {
      const request: FinalizarReparacionRequest = {
          Id: this.id, 
          IdOtTiempo: 0,
          Descripcion: this.model.descripcion || 'Finalizado por remozado',
          InformeTecnico: this.model.informetecnico || 'Cierre automático al marcar remozado',
          IdEstado: EstadoOT.Remozado
      };

      this.reparacionService.finalizarReparacion(request).subscribe({
          next: () => {
            this.estaFinalizada = true;   
            clearInterval(this.intervalRef);
            this.contador = { dias:0, horas:0, minutos:0, segundos:0 };
            this.cargarOrdenTrabajoDetalle();

            // 👇 Agregado igual que irreparable
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'El equipo fue marcado como remozado y la OT finalizada.'
            });

            this.router.navigate(['reparacion/panel']);
          },
          error: (err) => {
            console.error('❌ Error al marcar remozado:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo marcar como remozado.'
            });
          }
      });
    }
  });
}

confirmarIrreparable() {
  this.confirmationService.confirm({
    message: '¿Estás seguro de que deseas marcar este producto como irreparable?',
    header: 'Confirmar irreparable',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Sí, marcar',
    rejectLabel: 'Cancelar',
    accept: () => {
const request: FinalizarReparacionRequest = {
  Id: this.id,
  IdOtTiempo: 0,
  Descripcion: this.model.descripcion || '',
  InformeTecnico: this.model.informetecnico || '',
  IdEstado: EstadoOT.Irreparable
};

      this.reparacionService.finalizarReparacion(request).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'El equipo fue marcado como irreparable y la OT finalizada.'
          });
          // this.bloquearUIyResetearContador();
          // this.cargarOrdenTrabajoDetalle();

          this.router.navigate(['reparacion/panel']);
        },
        error: (err) => {
          console.error('❌ Error al marcar irreparable:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo marcar como irreparable.'
          });
        }
      });
    }
  });
}


// confirmarIrreparable() {

//   this.confirmationService.confirm({
//     message: '¿Estás seguro de que deseas marcar este producto como irreparable?',
//     header: 'Confirmar acción',
//     icon: 'pi pi-exclamation-triangle',
//     acceptLabel: 'Sí, marcar',
//     rejectLabel: 'Cancelar',
//     accept: () => {
//       this.marcarIrreparable(this.id);

//       const request: FinalizarReparacionRequest = {
//           id: this.id, idOtTiempo: 0,
//           descripcion: this.model.descripcion || 'Finalizado por remozado',
//           informeTecnico: this.model.informetecnico || 'Cierre automático al marcar remozado',
//           idestado: EstadoOT.Irreparable // Asignar el estado de remozado
//       };


//       this.reparacionService.finalizarReparacion(request).subscribe({
//           next: () => {
//             this.estaFinalizada = true;   
//             clearInterval(this.intervalRef);
//             this.contador = { dias:0, horas:0, minutos:0, segundos:0 };
//             //this.cargarOrdenTrabajoDetalle();
//           }
//         });
    

      
//     }
//   });
// }
// marcarIrreparable(idOrdenServicio: number) {
//   this.reparacionService.asignarIrreparable(idOrdenServicio).subscribe({
//     next: (res) => {
//       if (res.res) {
        
//         this.messageService.add({ severity: 'success', summary: 'Éxito', detail: res.mensaje });  
//         this.cargarOrdenTrabajoDetalle();
        


//       } else {
//         this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: res.mensaje });
//       }
//     },
//     error: (err) => {
//       console.error(err);
//       this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo procesar la operación.' });
//     }
//   });
//}
marcarRemozado(id: number) {
  this.reparacionService.asignarRemozado(id).subscribe({
    next: (res) => {
      this.messageService.add({
        severity: res.res ? 'success' : 'warn',
        summary: res.res ? 'Éxito' : 'Advertencia',
        detail: res.mensaje
      });
        this.cargarOrdenTrabajoDetalle();
    },
    error: () => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo procesar la operación.'
      });
    }
  });
}
verAntecedentes() {
  this.reparacionService.obtenerAntecedentes(this.id).subscribe({
    next: (res) => {
      if (res.res) {
        this.antecedentes = res.data;
        this.mostrarDialogAntecedentes = true;

        console.log('Antecedentes obtenidos:', this.antecedentes);
        
      } else {
        this.messageService.add({
          severity: 'warn',
          summary: 'Aviso',
          detail: res.mensaje
        });
      }
    },
    error: (err) => {
      console.error(err);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo obtener los antecedentes.'
      });
    }
  });
}
  private buildFinalizarRequest(estado: EstadoOT): FinalizarReparacionRequest {
    return {
      Id: this.id,
      IdOtTiempo: 0, // si luego lo tienes real, cámbialo aquí
      Descripcion: this.model.descripcion || 'Cierre automático por irreparable',
      InformeTecnico: this.model.informetecnico || 'Se marca irreparable y se cierra la OT',
      IdEstado: estado,
    };
  }
  
  private bloquearUIyResetearContador(): void {
    this.controlesBloqueados = true;
    clearInterval(this.intervalRef);
    this.contador = { dias: 0, horas: 0, minutos: 0, segundos: 0 };
  }

}
interface DiagnosticoItem extends SelectItem<number> {
  data?: any;  // Puedes poner el tipo real aquí si tienes una clase Diagnostico
}

