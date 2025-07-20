import { Component, OnInit } from '@angular/core';


import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogService, DynamicDialogComponent, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ImportacionesocService } from '../importacionesoc.service';
import { MessageService, PrimeNGConfig } from 'primeng/api';



interface Documento {
  tipo: string;
  nombre: string;
  fechaSubida: Date;
}



@Component({
  selector: 'app-nextworkflow',
  templateUrl: './nextworkflow.component.html',
  styleUrls: ['./nextworkflow.component.css'],
  standalone: true,
  imports:  [
    CalendarModule,
    DropdownModule,
    FileUploadModule,
    TableModule,
    ButtonModule,
    CardModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,

  ]
})
export class NextworkflowComponent implements OnInit {

  documentoForm: FormGroup;
  totalSize : number = 0;
  totalSizePercent : number = 0;

  tiposDocumento = [
    { label: 'Seleccionar Tipo', value: null },
    { label: 'Purchase Order (PO)', value: '1' },
    { label: 'Proforma Invoice (PI)', value: '2' },
    { label: 'Credit Note', value: '3' },
  ];
  documentosCargados: Documento[] = [];
  
  instance: DynamicDialogComponent | undefined;
  files = [];



  
  constructor(private fb: FormBuilder,public ref: DynamicDialogRef, 
    private importacionesService: ImportacionesocService,
    private messageService: MessageService,
    private config: PrimeNGConfig,
    private dialogService: DialogService) {
   
      this.instance = this.dialogService.getInstance(this.ref);

      console.log('xD',this.instance);
     



    this.documentoForm = this.fb.group({
      fechaInicio: [null, Validators.required],
      fechaFin: [null, Validators.required],
      tipoDocumento: [null, Validators.required],
      archivoDocumento: [null, Validators.required],
    });

   }

  ngOnInit() {
    console.log('instance' ,this.instance.config.data);
    this.reloadFile();

  }


  onUpload(event: any) {

    console.log('entré');

    for (let file of event.files) {
      this.documentosCargados.push({
        tipo: this.documentoForm.value.tipoDocumento,
        nombre: file.name,
        fechaSubida: new Date(),
      });
    }
   // this.documentoForm.reset();
  }

  eliminarDocumento(documento: Documento) {
    this.documentosCargados = this.documentosCargados.filter((doc) => doc !== documento);
  }

  
uploadSelectedFiles(event) {


  this.files = event.currentFiles;
  this.files.forEach((file) => {
      this.totalSize += parseInt(this.formatSize(file.size));
  });
  this.totalSizePercent = this.totalSize / 10;

    this.importacionesService.uploadFile(1, this.files[0], this.instance.config.data.nU_ORDE_COMP,
      this.documentoForm.value.tipoDocumento
     ).subscribe((response: Blob) => {



      
     


        const blob = new Blob([response], { type: 'application/zip' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `BoletasMasivas_${Date.now}.zip`;
        a.click();
        window.URL.revokeObjectURL(url);


        this.messageService.add({
          severity: 'info',
          summary: 'Exitoso',
          detail: 'Archivo cargado',
          life: 3000
        });



      }, error => {
        console.error('Error downloading the file', error);
      });

      


  
}

formatSize(bytes) {
  const k = 1024;
  const dm = 3;
  const sizes = this.config.translation.fileSizeTypes;
  if (bytes === 0) {
      return `0 ${sizes[0]}`;
  }

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

  return `${formattedSize} ${sizes[i]}`;
}
reloadFile() {

this.importacionesService.getFiles(this.instance.config.data.nU_ORDE_COMP).subscribe(resp => {
  console.log('documentos',resp);
  this.documentosCargados = resp;
})

  // for (let file of event.files) {
  //   this.documentosCargados.push({
  //     tipo: this.documentoForm.value.tipoDocumento,
  //     nombre: file.name,
  //     fechaSubida: new Date(),
  //   });
  // }
}


  Iniciar(){

    this.importacionesService.IniciarEstado(this.instance.config.data.nU_ORDE_COMP).subscribe(resp => {
        console.log('resp');
        

        this.messageService.add({
          severity: 'success',
          summary: 'Exitoso',
          detail: 'Se ha iniciado de manera exitosa',
          life: 3000
        });



    });

  }
  Finalizar() {

    this.importacionesService.FinalizarEstado   (this.instance.config.data.nU_ORDE_COMP).subscribe(resp => {
      console.log('resp');


      this.messageService.add({
        severity: 'success',
        summary: 'Exitoso',
        detail: 'Se ha finalizado de manera exitosa',
        life: 3000
      });



  });

  }

}
