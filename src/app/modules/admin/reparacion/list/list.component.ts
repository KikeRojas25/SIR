import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ReparacionService } from '../reparacion.service';
import { DialogModule } from 'primeng/dialog';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DialogService } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  standalone: true,
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
    CheckboxModule,
    RadioButtonModule 
  ],
  providers: [
    DialogService,
    MessageService,
    ConfirmationService
  ]
})
export class ListComponent implements OnInit {

  model: any = {};
  estados: SelectItem[] = [];
  tecnicos: SelectItem[] = [];
  tecnicoSeleccionado: any;

  cols: any[] = [];
  ordenes: any[] = [];
  visible = false;
  ordenSelected: any;

  userId: number;
  jwtHelper = new JwtHelperService();
  decodedToken: any = {};

  @Input() visibleFiltrado = false;
  @Input() datosQC = { ost: '', producto: '' };

  private _deshabilitarFechas = true;
  respuestas: { [key: string]: string } = {};
  respuestasOtro: { [key: string]: string } = {};
  
  
  preguntasIzquierda = [
    { texto: '¿Pantalla OK?', campo: 'pantalla' },
    { texto: '¿Case trasero OK?', campo: 'teclado' },
    { texto: '¿Tapa impresora OK?', campo: 'carcaza' },
    { texto: '¿Tapa bateria?', campo: 'backlight' },
    { texto: '¿Pruebas de funcionamiento?', campo: 'contactless' },
  ];

  // preguntasDerecha = [
  //   { texto: '¿Mica correcta?', campo: 'mica' },
  //   { texto: '¿Limpieza?', campo: 'limpieza' },
  //   { texto: '¿Estado correcto: Activo?', campo: 'estado' },
  //   { texto: '¿Banda magnética correcta?', campo: 'banda' },
  //   { texto: '¿Display correcto?', campo: 'display' },
  // ];

  get deshabilitarFechas(): boolean {
    return this._deshabilitarFechas;
  }

  set deshabilitarFechas(value: boolean) {
    this._deshabilitarFechas = value;
    if (value) {
      this.model.dateinicio = null;
      this.model.datefin = null;
    }
  }

  constructor(
    private reparacionService: ReparacionService,
    private messageService: MessageService,
      private confirmationService: ConfirmationService,
  ) {}

  ngOnInit() {
    const user = localStorage.getItem('token');
    this.decodedToken = this.jwtHelper.decodeToken(user);
    this.userId = this.decodedToken.nameid;

    this.cols = [

      { header: 'ASIGNAR', field: 'deRubr', width: '220px' },
      { header: 'ORDEN SERVICIO', field: 'tiOrdeComp', width: '120px' },
      // { header: 'IMEI', field: 'deRubr', width: '120px' },
      { header: 'PRODUCTO', field: 'nuOrdeComp', width: '120px' },
      { header: 'SERIE', field: 'stOrde', width: '220px' },
      { header: 'ESTADO', field: 'deRubr', width: '120px' },
       { header: 'TIPO REPARACIÓN', field: 'tiporeparacion', width: '120px' },
      { header: 'FEC. REGISTRO', field: 'deRubr', width: '120px' },
      { header: 'FEC. ASIGNACIÓN', field: 'deRubr', width: '120px' },
      { header: 'CLIENTE', field: 'tiOrdeComp', width: '120px' },
      { header: 'TEC. ASIGNADO', field: 'deRubr', width: '120px' },

    ];

    const hoy = new Date();
    this.model.datefin = hoy;
    this.model.dateinicio = new Date();
    this.model.dateinicio.setMonth(hoy.getMonth() - 1);

    this.cargarDropdownList();
  }

  cargarDropdownList() {
    this.reparacionService.getEstados(45).subscribe(data => {
      this.estados = data.map((estado: any) => ({
        value: estado.idestado,
        label: estado.estado
      }));
      this.estados.unshift({ value: null, label: 'Selecciona un estado' });
    });

    this.reparacionService.getTecnicos(this.userId).subscribe({
      next: (data) => {
        this.tecnicos = data.map(t => ({
          label: t.nombreCompleto,
          value: t.usr_int_id
        }));
        this.tecnicos.unshift({ label: 'Selecciona un técnico', value: null });
        this.tecnicoSeleccionado = this.tecnicos[0].value;
        //this.buscar(); // Cargar lista cuando los combos están listos
      },
      error: (error) => {
        console.error('Error al cargar técnicos:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los técnicos.' });
      }
    });
  }

  buscar() {
    const fecini = !this.deshabilitarFechas && this.model.dateinicio
      ? this.model.dateinicio.toISOString().split('T')[0]
      : null;

    const fecfin = !this.deshabilitarFechas && this.model.datefin
      ? this.model.datefin.toISOString().split('T')[0]
      : null;

    this.reparacionService.listarOrdenServicio(
      this.model.os,
      this.userId,
      fecini,
      fecfin,
      this.model.idestado,
      this.model.serie
    ).subscribe(data => {
      this.ordenes = data;
      
      console.log('Ordenes:', this.ordenes);

    });
  }

  asignar(rowData: any) {
    this.ordenSelected = rowData;
    this.visible = true;
  }

  // confirmarAsignacion() {
  //   if (!this.tecnicoSeleccionado || !this.ordenSelected?.idordenserviciotecnico) {
  //     this.messageService.add({ severity: 'warn', summary: 'Faltan datos', detail: 'Seleccione un técnico' });
  //     return;
  //   }

  //   this.reparacionService.asignarOrdenTrabajo(this.ordenSelected.idordenserviciotecnico, this.tecnicoSeleccionado)
  //     .subscribe(() => {
  //       this.buscar();
  //       this.visible = false;
  //       this.messageService.add({
  //         severity: 'success',
  //         summary: 'Asignado',
  //         detail: 'Se ha asignado correctamente.',
  //         life: 3000
  //       });
  //     });
  // }
   confirmarAsignacion() {
    this.confirmationService.confirm({
      message: '¿Está seguro de asignar este técnico a la orden?',
      header: 'Confirmar asignación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',  
      accept: () => this.asignarTecnico()
    });
  }

  asignarTecnico() {
    if (!this.tecnicoSeleccionado || !this.ordenSelected?.idordenserviciotecnico) {
      this.messageService.add({ severity: 'warn', summary: 'Campos incompletos', detail: 'Seleccione técnico y orden' });
      return;
    }

    this.reparacionService.cambiarTecnico({
      idOrdenServicioTecnico: this.ordenSelected?.idordenserviciotecnico,
      idTecnico: this.tecnicoSeleccionado
    }).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Técnico asignado correctamente' });
        this.visible = false;
        this.tecnicoSeleccionado = null;
        this.buscar();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo asignar el técnico' });
        console.error(err);
      }
    });
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'Pend. Asignación': return '#ffcccb';
      case 'Pend. Proceso QC': return '#fff59d';
      case 'Cerrada': return '#c8e6c9';
      default: return 'transparent';
    }
  }

  getButtonLabel(estado: string): string {
    return estado === 'Pend. Asignación' ? 'Asignar' : 'Reasignar';
  }

  guardarFiltrado() {
    console.log('Respuestas QC:', this.respuestas);
    this.visibleFiltrado = false;
    // Aquí puedes llamar a tu servicio para guardar la información
  }

  verFiltrado(rowData: any) {


  this.inicializarRespuestasPorDefecto() ;

    this.ordenSelected = rowData;


    this.visibleFiltrado = true;

  }
  inicializarRespuestasPorDefecto() {
    this.respuestas = {};
    for (let item of this.preguntasIzquierda) {
      this.respuestas[item.campo] = 'true'; // todos preseleccionados como "Sí"
    }
  }
}
