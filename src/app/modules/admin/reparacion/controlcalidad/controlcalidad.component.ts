import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
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
import { ReparacionService } from '../reparacion.service';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-controlcalidad',
  templateUrl: './controlcalidad.component.html',
  styleUrls: ['./controlcalidad.component.css'],
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
        RadioButtonModule 
    
      ],
      providers: [
        DialogService,
        MessageService ,
        ConfirmationService
        ]
})
export class ControlcalidadComponent implements OnInit { 
  model: any = {};
  estados: SelectItem[] = [];
  cols: any[];
  ordenes: any[];
  ordenSelected: any;
  userId: number;
  jwtHelper = new JwtHelperService();
  decodedToken: any = {};
    @Input() visible = false;
  @Input() datosQC = { ost: '', producto: '' };


  
  preguntasIzquierda = [
    { texto: '¿Versión del Software correcta?', campo: 'software' },
    { texto: '¿Teclado correcto?', campo: 'teclado' },
    { texto: '¿Carcaza?', campo: 'carcaza' },
    { texto: '¿Backlight correcto?', campo: 'backlight' },
    { texto: '¿Contactless correctos?', campo: 'contactless' },
  ];

  preguntasDerecha = [
    { texto: '¿Mica correcta?', campo: 'mica' },
    { texto: '¿Limpieza?', campo: 'limpieza' },
    { texto: '¿Estado correcto: Activo?', campo: 'estado' },
    { texto: '¿Banda magnética correcta?', campo: 'banda' },
    { texto: '¿Display correcto?', campo: 'display' },
  ];


  respuestas: { [key: string]: string } = {};

  constructor(private reparacionService: ReparacionService
   , private messageService: MessageService
   , private router: Router,
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
      { header: 'ESTADO', backgroundcolor: '#125ea3', field: 'otestado', width: '120px' },
     
     
      { header: 'FEC. ASIGNACIÓN', backgroundcolor: '#125ea3', field: 'deRubr', width: '120px' },
    
      
      { header: 'TEC. ASIGNADO', backgroundcolor: '#125ea3', field: 'deRubr', width: '120px' },
      { header: 'ASIGNAR', backgroundcolor: '#125ea3', field: 'deRubr', width: '120px' },

    ]

    this.model.dateinicio = new Date();
    this.model.datefin = new Date();

    this.model.dateinicio.setMonth(this.model.dateinicio.getMonth() - 1);

      this.cargarDropdownList();


  }
  cargarDropdownList() {
  
    this.reparacionService.getEstados(77).subscribe(data => {
      console.log('Datos recibidos:', data);
      this.estados = data.map((estado: any) => ({
        value: estado.idestado,
        label: estado.estado
      }));
      this.estados.unshift({ value: null, label: 'Selecciona un estado' });
    });

      this.buscar()

  }
  buscar(){


    const fecini = this.model.dateinicio ? this.model.dateinicio.toISOString().split('T')[0] : null;
     const fecfin = this.model.datefin ? this.model.datefin.toISOString().split('T')[0] : null;

    this.reparacionService.listarOrdenServicioTecnico( this.model.os ,this.userId , fecini
      , fecfin, 54, this.model.serie).subscribe(data => {


      console.log('Datos recibidos:', data);

      

      this.ordenes = data;
    //  this.ordenes = data.filter(item => item.otestado !== null && item.otestado !== '');


    });


  }
  iniciar(rowData: any) {

    this.ordenSelected = rowData;

    console.log(rowData);

    this.visible = true;

  }
  confirmarAsignacion() {

   console.log( this.ordenSelected.idordenserviciotecnico , this.userId  );

   this.reparacionService.asignarOrdenTrabajo(this.ordenSelected.idordenserviciotecnico  ,  this.userId  ).subscribe(resp => {


    this.buscar();

    this.messageService.add({
      severity: 'success',
      summary: 'Asignado',
      detail: 'Se ha asignado correctamente.',
      life: 3000
    });







   })

  }
  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'Detenida':
        return 'estado-detenida';
      case 'En Atención':
        return 'estado-atencion';
      case 'Completada':
        return 'estado-completada';
      case 'Pendiente':
        return 'estado-pendiente';
      default:
        return 'estado-default';
    }
  }
  
  guardarQC() {
    console.log('Respuestas QC:', this.respuestas);
    this.visible = false;
    // Aquí puedes llamar a tu servicio para guardar la información
  }
  

}
