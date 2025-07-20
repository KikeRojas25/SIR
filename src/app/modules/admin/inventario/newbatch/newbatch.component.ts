import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MessageService, ConfirmationService, SelectItem, PrimeNGConfig } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CicService } from '../../cic/cic.service';
import { DocumentoRecepcion, DocumentoRecepcionDetalle } from '../../cic/cic.type';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-newbatch',
  templateUrl: './newbatch.component.html',
  styleUrls: ['./newbatch.component.css'],
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
export class NewbatchComponent implements OnInit {

  sucursales: SelectItem[];
  almacenes: SelectItem[];
  userId: number;
  mostrarBotonProcesar: boolean = false;
  detalles: DocumentoRecepcionDetalle[] = [];


  files = [];
  totalSize : number = 0;
  totalSizePercent : number = 0;
  model: any = {};
  origenes: SelectItem[];
  productos: SelectItem[];
  fabricantes: SelectItem[];

  
  clientes: SelectItem[];
  partners: SelectItem[];

  form: FormGroup;


  
  constructor(          
    private messageService: MessageService,
    private config: PrimeNGConfig,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private sirService: CicService,) { }

 
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

  selectAlmacen(sucursal: any) {
    console.log(sucursal.value);
    this.obtenerAlmacenes(sucursal.value);
  }

    obtenerAlmacenes(idSucursal: number) {
    this.sirService.getAlmacenes(idSucursal).subscribe(data => {

      console.log('almacen', data);

      this.almacenes =  data.map((x: any)=> ({ value: x.idAlmacen, label: x.nombrealmacen    }) );
    });
  }



  obtenerPartners() {
    this.sirService.getParterns().subscribe(data => {
      console.log(data);
      this.partners = data.map((x: any)=> ({ value: x.idPartner, label: x.razonSocial    }) )
    });
  }
  obtenerValorTabla(tablaId: number) {
    this.sirService.getAllValorTabla(tablaId).subscribe(data => {
      
      this.origenes = data.map((x: any)=> ({ value: x.idValorTabla, label: x.valor    }) )


    });
  }

  obtenerClientes() {
    this.sirService.getClientes().subscribe(data => {
      console.log(data);
      this.clientes = data.map((x: any)=> ({ value: x.idCliente, label: x.nombre    }) )
    });
  }

  
  obtenerProductos() {
    this.sirService.getProductos().subscribe(data => {
      console.log(data);
      this.productos = data.map((x: any)=> ({ value: x.idProducto, label: x.descripcionLarga    }) )
    });
  }

  obtenerSucursales() {
    this.sirService.getSucursal().subscribe(data => {
      this.sucursales = data.map((x: any)=> ({ value: x.idsucursal, label: x.nombre    }) )
    });
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
  
        this.sirService.insertarDocumentoRecepcion(payload).subscribe({
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
}
