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
import { CicService } from '../../cic/cic.service';
import { ReparacionService } from '../../reparacion/reparacion.service';

@Component({
  selector: 'app-reporteporoperador',
  templateUrl: './reporteporoperador.component.html',
  styleUrls: ['./reporteporoperador.component.css'],
  standalone : true,
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
export class ReporteporoperadorComponent implements OnInit {


   model: any = {};
   estados: SelectItem[] = [];
   cols: any[];
   ordenes: any[];
   visible = false;
   ordenSelected: any;
   userId: number;
   jwtHelper = new JwtHelperService();
   decodedToken: any = {};
   sucursales: SelectItem[];
   almacenes: SelectItem[];

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
   constructor(private reparacionService: ReparacionService
    , private messageService: MessageService
    , private cicService: CicService
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

    this.obtenerSucursales();
 
     this.reparacionService.getEstados(45).subscribe(data => {
       console.log('Datos recibidos:', data);
       this.estados = data.map((estado: any) => ({
         value: estado.idestado,
         label: estado.estado
       }));
       this.estados.unshift({ value: null, label: 'Selecciona un estado' });
     });
 
  
     
   }
   buscar() {
    const fecinicio = this.model.dateinicio ? this.formatDate(this.model.dateinicio) : '';
    const fecfin = this.model.datefin ? this.formatDate(this.model.datefin) : '';
    const idestado = this.model.idestado ?? '';
    const idalmacen = this.model.idalmacen ?? '';
    const idtecnico = this.model.idtecnico ?? '';
  
    const finalUrl = `http://104.36.166.65/RepSW/Rep_BaseIngenicoTecnico.aspx?fecinicio=${fecinicio}&fecfin=${fecfin}&idestado=${idestado}&idalmacen=${idalmacen}&idtecnico=${idtecnico}`;
    window.open(finalUrl, '_blank');
  }
  
  formatDate(date: any): string | null {
    if (!date) return null;
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }
  

   asignar(rowData: any) {
 
     this.ordenSelected = rowData;
 
     this.visible = true;
 
   }
   selectAlmacen(sucursal: any) {
    console.log(sucursal.value);
    this.obtenerAlmacenes(sucursal.value);
   }

   
  obtenerAlmacenes(idSucursal: number) {
    this.cicService.getAlmacenes(idSucursal).subscribe(data => {

      console.log('almacen', data);

      this.almacenes =  data.map((x: any)=> ({ value: x.idAlmacen, label: x.nombrealmacen    }) );
    });
  }
  obtenerSucursales() {
    this.cicService.getSucursal().subscribe(data => {
      this.sucursales = data.map((x: any)=> ({ value: x.idsucursal, label: x.nombre    }) )
    });
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
 