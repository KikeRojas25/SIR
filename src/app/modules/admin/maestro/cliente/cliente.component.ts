import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';

// PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';

// Angular Material
import { MatIconModule } from '@angular/material/icon';

// Servicio y tipos
import { MaestroService } from '../maestro.service';
import { Cliente, ValorTabla } from '../maestro.types';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    TableModule, ButtonModule, InputTextModule, DialogModule, DropdownModule,
    MatIconModule, ToastModule, ConfirmDialogModule
  ], 
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class ClienteComponent implements OnInit {
  clientes: Cliente[] = [];
  model: any = { cliente: '' };

  // loader
  loading: boolean = false;

  // modal
  displayDialog: boolean = false;
  isNuevo: boolean = false;
  selectedCliente: Cliente = {} as Cliente;

  // catálogo tipos de documento
  tiposDocumento: { label: string; value: number }[] = [];

  constructor(
    private maestroService: MaestroService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.cargarTiposDocumento();
    this.buscarCliente();
  }

cargarTiposDocumento() {
  this.maestroService.getValoresTabla(11).subscribe({
    next: (data: ValorTabla[]) => {
      this.tiposDocumento = data.map(item => ({
        label: item.valor,       // lo que verá el usuario: "DNI", "RUC"
        value: item.idValorTabla // lo que se guarda en BD
      }));
    },
    error: (err) => console.error('Error al cargar tipos de documento', err)
  });
}


  buscarCliente() {
    this.loading = true;
    this.maestroService.buscarClientes(this.model.cliente || '').subscribe({
      next: (data) => {
        this.clientes = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al buscar clientes', err);
        this.loading = false;
      }
    });
  }

  onClienteChange(value: string) {
    if (!value || value.trim() === '') {
      this.buscarCliente();
    }
  }

  limpiarCliente() {
    this.model.cliente = '';
    this.buscarCliente();
  }

  nuevo() {
    this.isNuevo = true;
    this.selectedCliente = {
      idTipoDocumento: 0,
      nombre: '',
      numeroDocumento: '',
      celular: '',
      email: '',
      telefono: '',
      activo: true
    };
    this.displayDialog = true;
  }

  editar(cliente: Cliente) {
  this.isNuevo = false;
  this.selectedCliente = { ...cliente };

  // 👇 aquí la conversión
  if (cliente.idTipoDocumento && cliente.tipoDocumento) {
    this.selectedCliente.idTipoDocumento = Number(cliente.idTipoDocumento);
  }

  this.displayDialog = true;
}
guardar() {
  // 🔹 Armamos solo el objeto que el backend espera
  const clienteToSend = {
    idCliente: this.selectedCliente.idCliente,
    idTipoDocumento: this.selectedCliente.idTipoDocumento,  // ✅ el id que viene del dropdown
    numeroDocumento: this.selectedCliente.numeroDocumento,
    nombre: this.selectedCliente.nombre,
    celular: this.selectedCliente.celular,
    email: this.selectedCliente.email,
    telefono: this.selectedCliente.telefono,
    activo: true
  };

  if (this.isNuevo) {
    this.maestroService.registrarCliente(clienteToSend).subscribe({
      next: () => {
        this.displayDialog = false;
        this.buscarCliente();
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente registrado con éxito' });
      },
      error: (err) => {
        console.error('Error al registrar cliente', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo registrar el cliente' });
      }
    });
  } else {
    this.maestroService.actualizarCliente(clienteToSend).subscribe({
      next: () => {
        this.displayDialog = false;
        this.buscarCliente();
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente actualizado con éxito' });
      },
      error: (err) => {
        console.error('Error al actualizar cliente', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el cliente' });
      }
    });
  }
}


  eliminar(cliente: Cliente) {
    this.confirmationService.confirm({
      message: `¿Seguro que deseas eliminar al cliente: ${cliente.nombre}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.maestroService.eliminarCliente(cliente.idCliente!).subscribe({
          next: () => {
            this.clientes = this.clientes.filter(c => c.idCliente !== cliente.idCliente);
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente eliminado con éxito', life: 3000 });
          },
          error: (err) => {
            console.error('Error al eliminar cliente', err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el cliente', life: 3000 });
          }
        });
      }
    });
  }
}
