import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MessageService, ConfirmationService, SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ReparacionService } from '../../reparacion/reparacion.service';
import { CicService } from '../cic.service';

@Component({
  selector: 'app-panelrecepcion',
  templateUrl: './panelrecepcion.component.html',
  styleUrls: ['./panelrecepcion.component.css'],
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
      CheckboxModule
  
    ],
    providers: [
      DialogService,
      MessageService ,
      ConfirmationService
      ]
})
export class PanelrecepcionComponent implements OnInit {

  model: any = {};
  estados: SelectItem[] = [];
  cols: any[];
  ordenes: any[];
  visible = false;
  ordenSelected: any;
  userId: number;
  jwtHelper = new JwtHelperService();
  decodedToken: any = {};
    // ✅ Propiedad privada del checkbox
    private _deshabilitarFechas = true;


  get deshabilitarFechas(): boolean {
    return this._deshabilitarFechas;
  }

  set deshabilitarFechas(value: boolean) {
    this._deshabilitarFechas = value;

    // Al desactivar, se limpian las fechas
    if (value) {
      this.model.dateinicio = null;
      this.model.datefin = null;
    }
  }
  constructor(private recepcionService: CicService
   , private messageService: MessageService
  ) { }

  ngOnInit() {

    const user  = localStorage.getItem('token');
    this.decodedToken = this.jwtHelper.decodeToken(user);
    this.userId = this.decodedToken.nameid;


    this.cols = [
      { header: 'ORDEN SERVICIO', backgroundcolor: '#125ea3', field: 'tiOrdeComp', width: '120px' },
      { header: 'IMEI', backgroundcolor: '#125ea3', field: 'deRubr', width: '120px' },
   
      { header: 'PRODUCTO', backgroundcolor: '#125ea3', field: 'nuOrdeComp', width: '120px' },
      { header: 'SERIE', backgroundcolor: '#125ea3', field: 'stOrde', width: '120px' },
      { header: 'ESTADO', backgroundcolor: '#125ea3', field: 'deRubr', width: '120px' },
     
     
      { header: 'FEC. ASIGNACIÓN', backgroundcolor: '#125ea3', field: 'deRubr', width: '120px' },
      { header: 'TIPO', backgroundcolor: '#125ea3', field: 'tiOrdeComp', width: '120px' },
    
      
      { header: 'TEC. ASIGNADO', backgroundcolor: '#125ea3', field: 'deRubr', width: '120px' },
      { header: 'ASIGNAR', backgroundcolor: '#125ea3', field: 'deRubr', width: '120px' },

    ]

    this.model.dateinicio = new Date();
    this.model.datefin = new Date();

    this.model.dateinicio.setMonth(this.model.dateinicio.getMonth() - 1);

    this.cargarDropdownList();
   


  }
  cargarDropdownList()  {

    // this.recepcionService.getEstados(45).subscribe(data => {
    //   console.log('Datos recibidos:', data);
    //   this.estados = data.map((estado: any) => ({
    //     value: estado.idestado,
    //     label: estado.estado
    //   }));
    //   this.estados.unshift({ value: null, label: 'Selecciona un estado' });
    // });

      this.buscar()
    
  }
  
  buscar() {
    // Si el filtro de fechas está habilitado, usa los valores, si no, envía null
    const fecini = !this.deshabilitarFechas && this.model.dateinicio
      ? this.model.dateinicio.toISOString().split('T')[0]
      : null;
  
    const fecfin = !this.deshabilitarFechas && this.model.datefin
      ? this.model.datefin.toISOString().split('T')[0]
      : null;
  
    this.recepcionService.listarDocumentosRecepcion(
      fecini,
      fecfin,
      this.model.numeroordenservicio
    ).subscribe(data => {
      console.log('Datos recibidos:', data);
      this.ordenes = data;
    });
  }



  
  
  asignar(rowData: any) {

    this.ordenSelected = rowData;

    this.visible = true;

  }
  confirmarAsignacion() {

   console.log( this.ordenSelected.idordenserviciotecnico , this.userId  );

  //  this.reparacionService.asignarOrdenTrabajo(this.ordenSelected.idordenserviciotecnico  ,  this.userId  ).subscribe(resp => {


  //   this.buscar();

  //   this.messageService.add({
  //     severity: 'success',
  //     summary: 'Asignado',
  //     detail: 'Se ha asignado correctamente.',
  //     life: 3000
  //   });







  //  })

  }
  getEstadoColor(estado: string): string {
    switch (estado) {
        case 'Pend. Asignación': return '#ffcccb'; // rojo claro
        case 'Pend. Proceso QC': return '#fff59d'; // amarillo claro
        case 'Pend. Despacho al Cliente': return '#c8e6c9'; // verde claro
      
        default: return 'transparent'; // sin color
    }
}

getButtonLabel(estado: string): string {
  if (estado === 'Pend. Asignación') {
      return 'Asignar';
  }
  return 'Reasignar';
}



}

