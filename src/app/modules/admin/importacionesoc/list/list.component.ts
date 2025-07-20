import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ImportacionesocService } from '../importacionesoc.service';
import { MessageService, SelectItem } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { OCResult } from '../importacionesoc.type';
import { CommonModule } from '@angular/common';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from 'primeng/dialog';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import moment from 'moment';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NextworkflowComponent } from '../nextworkflow/nextworkflow.component';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';


interface EventItem {
  status?: string;
  date?: Date;
  icon?: string;
  color?: string;
  image?: string;
  approvedBy?: string;
}


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  standalone:true,
  imports: [MatIcon, 
    InputTextModule, 
    DropdownModule,
    FormsModule,
    ButtonModule,
    TableModule,
    CommonModule,
    DialogModule   ,
    TimelineModule ,
    CardModule ,
    DynamicDialogModule ,
    ToastModule,
    ButtonsModule
    ],
    providers: [DialogService, MessageService ]
})
export class ListComponent implements OnInit {
  ref: DynamicDialogRef | undefined;
  ocResults: any[];
  searchCriteria = { oc: '', sku: '' };
  rubros: SelectItem[] = [];
  familias: any[] = [];
  subfamilias: any[] = [];
  cols: any[];
  cols2: any[];
  detalleOCModal = false;
  CicloVidaOCModal = false;
  Items: any[];
  selectedOC : any = {};

  selectedRubro: any;
  selectedFamilia: any;
  selectedSubfamilia: any;
  events: EventItem[];
  events2: EventItem[];
  model: any = { sku:null,NumOrdenCompra:null,CodRubro: null, CodSubFamilia: null,CodFamilia: null };

  



  constructor(private importacionesOcService: ImportacionesocService,
    public dialogService: DialogService
  ) { }

  
  ngOnInit(): void {


    this.cols2 = [
      { header: 'NUM OC', backgroundcolor: '#125ea3', field: 'tiOrdeComp', width: '120px' },
      { header: 'COD ITEM', backgroundcolor: '#125ea3', field: 'tiOrdeComp', width: '120px' },
      { header: 'DES ITEM', backgroundcolor: '#125ea3', field: 'nuOrdeComp', width: '120px' },
      { header: 'CANTIDAD ORDENADA', backgroundcolor: '#125ea3', field: 'stOrde', width: '120px' },
      { header: 'CANTIDAD INGRESADA', backgroundcolor: '#125ea3', field: 'deRubr', width: '120px' },
      { header: 'IMPORTE', backgroundcolor: '#125ea3', field: 'deRubr', width: '120px' },
      { header: 'TOTAL', backgroundcolor: '#125ea3', field: 'deRubr', width: '120px' },

    ]

    this.cols = [
      { header: 'Acciones', backgroundcolor: '#125ea3', field: 'tiOrdeComp', width: '100px' },
      { header: 'Etapa', backgroundcolor: '#125ea3', field: 'tiOrdeComp', width: '120px' },
      { header: 'Estado Importación', backgroundcolor: '#125ea3', field: 'nuOrdeComp', width: '120px' },
      { header: 'OC', backgroundcolor: '#125ea3', field: 'stOrde', width: '120px' },
      { header: 'Estado OC', backgroundcolor: '#125ea3', field: 'stOrde', width: '120px' },
      { header: 'Rubro', backgroundcolor: '#125ea3', field: 'deRubr', width: '120px' },
  
      { header: 'Cod. Proveedor', backgroundcolor: '#125ea3', field: 'cO_PROV', width: '120px' },
      { header: 'Proveedor', backgroundcolor: '#125ea3', field: 'nO_PROV', width: '240px' },
      { header: 'Origen', backgroundcolor: '#125ea3', field: 'deOrig', width: '80px' },
      { header: 'Marca', backgroundcolor: '#125ea3', field: 'deMarc', width: '90px' },
  
      { header: 'Cantidad Ordenada', backgroundcolor: '#125ea3', field: 'caOrde', width: '120px' },
      { header: 'Cantidad Facturada', backgroundcolor: '#125ea3', field: 'caFact', width: '120px' },
      { header: 'Cantidad Ingresada', backgroundcolor: '#125ea3', field: 'caIngr', width: '120px' },
      { header: 'Cantidad Pendiente', backgroundcolor: '#125ea3', field: 'caPend', width: '120px' },
      { header: 'Moneda', backgroundcolor: '#125ea3', field: 'coMone', width: '120px' },
      { header: 'Importe Unitario', backgroundcolor: '#125ea3', field: 'imUnit', width: '120px' },
      { header: 'Importe Total Fob', backgroundcolor: '#125ea3', field: 'imTotaFobs', width: '120px' },
      { header: 'Fecha Emisión', backgroundcolor: '#125ea3', field: 'feEmis', width: '120px' },
      { header: 'Fecha Llegada', backgroundcolor: '#125ea3', field: 'feLleg', width: '120px' },
      { header: 'Fecha Zarpe', backgroundcolor: '#125ea3', field: 'feZarp', width: '120px' },
      { header: 'Fecha Arribo', backgroundcolor: '#125ea3', field: 'feArri', width: '120px' },
      { header: 'Fecha Estimada', backgroundcolor: '#125ea3', field: 'feEsti', width: '120px' },
      { header: 'Tipo Embarque', backgroundcolor: '#125ea3', field: 'tiEmba', width: '120px' },
  
      { header: 'Fecha Llegada Final', backgroundcolor: '#125ea3', field: 'feLlegFina', width: '120px' },
  
      // Nuevos campos
      { header: 'Pago Primer Adelanto', backgroundcolor: '#125ea3', field: 'pagoPrimerAdelanto', width: '120px' },
      { header: 'Producción', backgroundcolor: '#125ea3', field: 'produccion', width: '120px' },
      { header: 'Inspección AQF', backgroundcolor: '#125ea3', field: 'inspeccionAQF', width: '120px' },
      { header: 'Segundo Pago', backgroundcolor: '#125ea3', field: 'segundoPago', width: '120px' },
      { header: 'Booking', backgroundcolor: '#125ea3', field: 'booking', width: '120px' },
      { header: 'Tránsito Marítimo', backgroundcolor: '#125ea3', field: 'transitoMaritimo', width: '120px' },
      { header: 'Retiro Aduanas', backgroundcolor: '#125ea3', field: 'retiroAduanas', width: '120px' }
  ];

  

    this.cargarRubros();
    this.buscar();
  }

  cargarRubros() {

    this.importacionesOcService.getRubros().subscribe({
      next: data => {
        this.rubros = data.map(list => ({
          value: list.co_rubr,
          label: list.de_rubr
        }));
      },
      error: (err) => {
        console.error('Error fetching rubros:', err); // Manejo básico de errores
      }
  })

}

  onRubroChange(event: any) {
    this.selectedFamilia = null;
    this.selectedSubfamilia = null;
    this.familias = [];
    this.subfamilias = [];

    console.log('seleccionado', this.selectedRubro);

    if (this.selectedRubro) {
      this.importacionesOcService.getFamilias(this.selectedRubro).subscribe({
        next: data => {
          this.familias = data.map(list => ({
            value: list.co_fami,
            label: list.de_fami
          })
          );
        }
       
      });
    }
  }

  onFamiliaChange(event: any) {
    this.selectedSubfamilia = null;
    this.subfamilias = [];

    if (this.selectedFamilia) {
      this.importacionesOcService.getSubfamilias(this.selectedFamilia).subscribe({
        next: data => {
          this.subfamilias = data.map(list => ({

            value: list.co_sfam,
            label: list.de_sfam


          }))
        }
       
      });
    }
  }

  buscar() {
    // Lógica para realizar la búsqueda usando searchCriteria, selectedRubro, selectedFamilia, selectedSubfamilia

    this.importacionesOcService.getOcs(this.model).subscribe({
      next: data => {

         //this.ocResults = this.mapToOCResult(data);
        this.ocResults = data;

        console.log('resultados',this.ocResults);

      }
    });

  }

  getOCResults() {
    // this.importacionesOcService.getData().subscribe(apiDataArray => {
    //     const ocResults: OCResult[] = apiDataArray.map(apiData => this.mapToOCResult(apiData));
    //     // Ahora ocResults contiene la lista de objetos mapeados
    // });
}
mapToOCResult(apiData: any): OCResult {
  return {
    tI_ORDE_COMP: apiData.tI_ORDE_COMP,
    dE_RUBR: apiData.dE_RUBR,
    dE_FAMI: apiData.dE_FAMI,
    dE_SFAM: apiData.dE_SFAM,
    cO_PROV: apiData.cO_PROV,
    nO_PROV: apiData.nO_PROV,
    dE_ORIG: apiData.dE_ORIG,
    dE_MARC: apiData.dE_MARC,
    cO_SAPS: apiData.cO_SAPS,
    cO_ITEM: apiData.cO_ITEM,
    dE_ITEM: apiData.dE_ITEM,
    nU_ORDE_COMP: apiData.nU_ORDE_COMP,
    dE_OBSE: apiData.dE_OBSE,
    sT_ORDE: apiData.sT_ORDE,
    cA_ORDE: apiData.cA_ORDE,
    cA_FACT: apiData.cA_FACT,
    cA_INGR: apiData.cA_INGR,
    cA_PEND: apiData.cA_PEND,
    cO_MONE: apiData.cO_MONE,
    iM_UNIT: apiData.iM_UNIT,
    iM_TOTA_FOBS: apiData.iM_TOTA_FOBS,
    fE_EMIS: apiData.fE_EMIS,
    fE_LLEG: apiData.fE_LLEG,
    fE_ZARP: apiData.fE_ZARP,
    fE_ARRI: apiData.fE_ARRI,
    fE_ESTI: apiData.fE_ESTI,
    tI_EMBA: apiData.tI_EMBA,
    sT_CIERR_MANU: apiData.sT_CIERR_MANU,
    fE_LLEG_FINA: apiData.fE_LLEG_FINA,

    // Nuevos campos
    pagO_PRIMER_ADELANTO: apiData.pagoPrimerAdelanto,
    produccion: apiData.produccion,
    inspeccioN_AQF: apiData.inspeccionAQF,
    segundO_PAGO: apiData.segundoPago,
    booking: apiData.booking,
    transitO_MARITIMO: apiData.transitoMaritimo,
    retirO_ADUANAS: apiData.retiroAduanas,
    estado: apiData.estado,
    etapa: apiData.etapa

  };
}

verDetalle(rowData){
  console.log(rowData.nU_ORDE_COMP);
  this.detalleOCModal = true;



  this.importacionesOcService.getDetalleOC(rowData.nU_ORDE_COMP).subscribe({
    next: data => {
       this.Items = data;
       console.log('items', this.Items);
    }
  })




}
verCicloVida(rowData) {

  console.log('click',rowData);

  this.CicloVidaOCModal = true;

  
  this.events = [
    { status: 'Emisión de OC', date: moment('02/05/2024', 'DD/MM/YYYY').toDate(), icon: 'fa fa-file', color: '#9C27B0' , approvedBy: 'Enrique Rojas'},
    { status: 'Pago Primer Adelanto', date: moment('08/05/2024', 'DD/MM/YYYY').toDate(), icon: 'pi pi-credit-card', color: '#673AB7' , approvedBy: 'Enrique Rojas'},
    { status: 'Producción', date: moment('07/07/2024', 'DD/MM/YYYY').toDate(), icon: 'pi pi-credit-card', color: '#FF9800' , approvedBy: 'Enrique Rojas'},
    { status: 'Inspección AQF', date: moment('22/07/2024 00:00', 'DD/MM/YYYY').toDate(), icon: 'pi pi-check-square', color: '#4CAF50' , approvedBy: 'Enrique Rojas'},
    { status: 'Segundo Pago', date: moment('29/07/2024 00:00', 'DD/MM/YYYY').toDate(), icon: 'pi pi-credit-card', color: '#FFC107' , approvedBy: 'Enrique Rojas'},
    { status: 'Booking', date: moment('13/08/2024 00:00', 'DD/MM/YYYY').toDate(), icon: 'pi pi-calendar', color: '#03A9F4', approvedBy: 'Enrique Rojas' },
    { status: 'Tránsito Marítimo', date: moment('17/09/2024 00:00', 'DD/MM/YYYY').toDate(), icon: 'pi pi-calendar', color: '#009688' , approvedBy: 'Enrique Rojas'},
    { status: 'Retiro de Aduanas', date: moment('24/09/2024 00:00', 'DD/MM/YYYY').toDate(), icon: 'pi pi-box', color: '#607D8B', approvedBy: 'Enrique Rojas' }
];

this.events2= [
  { status: 'Emisión de OC', date: moment('02/05/2024', 'DD/MM/YYYY').toDate(), icon: 'pi pi-file', color: '#9C27B0' , approvedBy: 'Enrique Rojas'},
  { status: 'Pago Primer Adelanto', date: moment('08/05/2024', 'DD/MM/YYYY').toDate(), icon: 'pi pi-credit-card', color: '#673AB7' , approvedBy: 'Enrique Rojas'},
  { status: 'Producción', date: moment('07/07/2024', 'DD/MM/YYYY').toDate(), icon: 'pi pi-credit-card', color: '#FF9800' , approvedBy: 'Enrique Rojas'},
  { status: 'Inspección AQF', date: moment('22/07/2024 00:00', 'DD/MM/YYYY').toDate(), icon: 'pi pi-check-square', color: '#4CAF50' , approvedBy: 'Enrique Rojas'},
  { status: 'Segundo Pago', date: moment('29/07/2024 00:00', 'DD/MM/YYYY').toDate(), icon: 'pi pi-credit-card', color: '#FFC107' , approvedBy: 'Enrique Rojas'},
  { status: 'Booking', date: moment('13/08/2024 00:00', 'DD/MM/YYYY').toDate(), icon: 'pi pi-calendar', color: '#03A9F4', approvedBy: 'Enrique Rojas' },
  { status: 'Tránsito Marítimo', date: moment('17/09/2024 00:00', 'DD/MM/YYYY').toDate(), icon: 'pi pi-calendar', color: '#009688' , approvedBy: 'Enrique Rojas'},
  { status: 'Retiro de Aduanas', date: moment('24/09/2024 00:00', 'DD/MM/YYYY').toDate(), icon: 'pi pi-box', color: '#607D8B', approvedBy: 'Enrique Rojas' }
];





}

enviarImportaciones() {

  let data = this.selectedOC;

  console.log('entre', data);


  this.ref = this.dialogService.open(NextworkflowComponent
    , { 
   
      header: 'Enviar a importaciones',
      width: '50vw',
      modal:true,
      data: data,
      breakpoints: {
          '960px': '75vw',
          '640px': '90vw'
      },
    }
    
    );


}
solicitarPrimeraPago() {

}
enviarSustentoFinanzas(){

}

}
