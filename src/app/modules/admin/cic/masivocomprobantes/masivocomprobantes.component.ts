import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { ConfirmationService, MessageService, PrimeNGConfig, SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CicService } from '../cic.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DocumentoRecepcion, DocumentoRecepcionDetalle } from '../cic.type';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-masivocomprobantes',
  templateUrl: './masivocomprobantes.component.html',
  styleUrls: ['./masivocomprobantes.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatIcon,
    DynamicDialogModule ,
    DropdownModule ,
    CalendarModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    FileUploadModule ,
    ToastModule ,
    ProgressBarModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
  ],
  providers: [
         DialogService,
         MessageService ,
         ConfirmationService
         ]
})
export class MasivocomprobantesComponent implements OnInit {

  @ViewChild('fileUpload', { static: false }) fileUpload!: FileUpload;
  
  files = [];
  totalSize : number = 0;
  totalSizePercent : number = 0;
  model: any = {};
  origenes: SelectItem[];
  productos: SelectItem[];
  fabricantes: SelectItem[];

  clientes: SelectItem[];
  partners: SelectItem[];

  sucursales: SelectItem[];
  almacenes: SelectItem[];
 detalles: DocumentoRecepcionDetalle[] = [];

  mostrarBotonProcesar: boolean = false;


  public errors = 0;
  public value = 0;
  public indeterminate = true;
  public min = -10;
  public max = 10;
  public chunks = 10;
  result:  any =[];
  public currentItem;
  public pageSizes = true;
  public pageSize = 200;
  public previousNext = true;
  public skip = 0;
  public allowUnsort = true;


  public mySelection: number[] = [];

  divvisible = false;
  divprocesar = false;
  divprocesando = false;
  public progress: number;
  public message: string;
  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  userId: number;

  form: FormGroup;

  constructor( private authService: AuthService,
              private router: Router,
              private cicService: CicService,
              private messageService: MessageService,
              private config: PrimeNGConfig,
              private confirmationService: ConfirmationService,
              private fb: FormBuilder
              ) 
    {


    }

  ngOnInit(): void {
    this.obtenerValorTabla(34); // Ejemplo con TablaId 1
    this.obtenerClientes();
    this.obtenerSucursales();
    this.obtenerPartners();
    this.obtenerProductos();
    this.userId = 2;

    this.form = this.fb.group({
      numeroGuia: ['', Validators.required],
      idorigen: [null, Validators.required],
      idproducto: [null, Validators.required],
      idfabricante: [null, Validators.required],
      idcliente: [null, Validators.required],
      idpartner: [null, Validators.required],
      idsucursal: [null, Validators.required],
      idalmacen: [null, Validators.required],
      fechaRecepcion: [null, Validators.required]
    });


      this.form.patchValue({
      numeroGuia: 'GR-PRUEBA-001',
      idorigen: 1,
      idproducto: 101,
      idfabricante: 2,
      idcliente: 3,
      idpartner: 4,
      idsucursal: 5,
      idalmacen: 6,
      fechaRecepcion: new Date()
    });



  }



  obtenerValorTabla(tablaId: number) {
    this.cicService.getAllValorTabla(tablaId).subscribe(data => {
      
      this.origenes = data.map((x: any)=> ({ value: x.idValorTabla, label: x.valor    }) )


    });
  }

  obtenerClientes() {
    this.cicService.getClientes().subscribe(data => {
      console.log(data);
      this.clientes = data.map((x: any)=> ({ value: x.idCliente, label: x.nombre    }) )
    });
  }

  
  obtenerProductos() {
    this.cicService.getProductos().subscribe(data => {
      console.log(data);
      this.productos = data.map((x: any)=> ({ value: x.idProducto, label: x.descripcionLarga    }) )
    });
  }

  obtenerSucursales() {
    this.cicService.getSucursal().subscribe(data => {
      this.sucursales = data.map((x: any)=> ({ value: x.idsucursal, label: x.nombre    }) )
    });
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

  obtenerPartners() {
    this.cicService.getParterns().subscribe(data => {
      console.log(data);
      this.partners = data.map((x: any)=> ({ value: x.idPartner, label: x.razonSocial    }) )
    });
  }

  choose(event: Event, chooseCallback: Function) {
    chooseCallback(); // Llamada al callback interno de PrimeNG
  }
  upload() {
    console.log(this.fileUpload.upload());
    this.fileUpload.upload(); // Llama al método 'upload' del componente 'p-fileUpload'
  }

onTemplatedUpload(event: any): void {
  const archivo = event.files[0];
  const reader = new FileReader();

  reader.onload = (e: any) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });

    const hoja = workbook.SheetNames[0];
    const datos = XLSX.utils.sheet_to_json(workbook.Sheets[hoja], { defval: '' });

    // Ajuste para columnas: ITEM | S/N | IMEI | MAC | PRODUCTO
    this.detalles = datos.map((row: any): DocumentoRecepcionDetalle => ({
      numeropallet: '', // No disponible en Excel
      caja: '',         // No disponible en Excel
      repuesto: row['PRODUCTO'] || '',
      idtipoproducto: 1, // puedes setear fijo o deducir según 'PRODUCTO'
      fila: 1,          // No disponible en Excel
      idproducto: 0,     // Si necesitas, puedes mapearlo desde 'PRODUCTO'
      serie: row['S/N']?.toString() || '',
      imei: row['IMEI']?.toString() || '',
      idmodelo: 0,       // No disponible en Excel
      mac: row['MAC']?.toString() || '',
      cantidad: 1,
      fechahorapersonalizacion: null,
      idusuariopersonalizacion: null,
      idalmacen: this.form.value.idalmacen
    }));

    this.mostrarBotonProcesar = true;
  };

  reader.readAsArrayBuffer(archivo);
}



onSelectedFiles(event) {
  this.files = event.currentFiles;
  this.files.forEach((file) => {
      this.totalSize += parseInt(this.formatSize(file.size));
  });
  this.totalSizePercent = this.totalSize / 10;
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

onRemoveTemplatingFile(event, file, removeFileCallback, index) {
  removeFileCallback(event, index);
  this.totalSize -= parseInt(this.formatSize(file.size));
  this.totalSizePercent = this.totalSize / 10;
}

onClearTemplatingUpload(clear) {
  clear();
  this.totalSize = 0;
  this.totalSizePercent = 0;
}

uploadSelectedFiles(): void {
  if (!this.files || this.files.length === 0) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Advertencia',
      detail: 'Debe seleccionar al menos un archivo Excel.',
      life: 3000
    });
    return;
  }

  const archivo = this.files[0]; // solo usas el primero si es uno por carga
  const reader = new FileReader();

  reader.onload = (e: any) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });

    const hoja = workbook.SheetNames[0];
    const sheet = workbook.Sheets[hoja];

    // Si los encabezados son: ITEM | S/N | IMEI | MAC | PRODUCTO
    const datos = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false });

    this.detalles = datos.map((row: any): DocumentoRecepcionDetalle => ({
      numeropallet: '',
      caja: '',
      repuesto: false,
      idtipoproducto: 1,
      fila: 1,
      idproducto: 0, // Si necesitas, puedes mapearlo desde 'PRODUCTO'
      codigoproducto: row['PRODUCTO']?.toString() || '',
      serie: row['S/N']?.toString() || '',
      imei: row['IMEI']?.toString() || '',
      idmodelo: 0,
      mac: row['MAC']?.toString() || '',
      cantidad: 1,
      fechahorapersonalizacion: null,
      idusuariopersonalizacion: null,
      idalmacen: this.form.value.idalmacen
    }));

    this.messageService.add({
      severity: 'success',
      summary: 'Carga completada',
      detail: `${this.detalles.length} registros cargados.`,
      life: 3000
    });

    this.mostrarBotonProcesar = true;
  };

  reader.onerror = () => {
    this.messageService.add({
      severity: 'error',
      summary: 'Error de lectura',
      detail: 'No se pudo leer el archivo Excel.',
      life: 3000
    });
  };

  reader.readAsArrayBuffer(archivo);
}
procesarFormulario(): void {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    this.messageService.add({
      severity: 'warn',
      summary: 'Formulario incompleto',
      detail: 'Por favor complete todos los campos requeridos.'
    });
    return;
  }

  if (this.detalles.length === 0) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Sin detalles',
      detail: 'Debe cargar un archivo Excel antes de procesar.'
    });
    return;
  }

  this.confirmationService.confirm({
    acceptLabel: 'Agregar',
    rejectLabel: 'Cancelar',
    acceptIcon: 'pi pi-check',
    rejectIcon: 'pi pi-times',
    message: '¿Está seguro que desea procesar la carga masiva?',
    header: 'Procesar',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      const model = this.form.value;

      const documentoRecepcion: DocumentoRecepcion = {
        numeroGuia: model.numeroGuia,
        idpartner: model.idpartner,
        idfabricante: model.idfabricante,
        idproducto: model.idproducto,
        idalmacen: model.idalmacen,
        idorigen: model.idorigen,
        dua: '',
        numerodocumento: '',
        documentocliente: '',
        numerofacturacomercial: '',
        fechafacturacomercial: '',
        idtiporecibo: 1,
        guiaremision: model.numeroGuia,
        idusuarioregistro: this.userId,
        idordenservicio: 0,
        activo: true,
        fechahoraregistro: new Date().toISOString(),
        idcliente: model.idcliente,
        fechaRecepcion: model.fechaRecepcion
        
      };

      documentoRecepcion.fechafacturacomercial = model.fechafacturacomercial
  ? new Date(model.fechafacturacomercial).toISOString()
  : null;

  
      documentoRecepcion.fechaRecepcion = model.fechaRecepcion
  ? new Date(model.fechaRecepcion).toISOString()
  : null;



      const payload = {
        documentoRecepcion: documentoRecepcion,
        detalles: this.detalles
      };

      console.log('Payload a enviar:', payload);

      this.cicService.insertarDocumentoRecepcion(payload).subscribe({
        next: (resp) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Datos procesados correctamente.'
          });
          this.mostrarBotonProcesar = false;
          this.form.reset();
          this.detalles = [];
        },
        error: (err) => {
          console.error('Error en el backend:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Ocurrió un error al procesar.'
          });
        }
      });
    }
  });
}


}
