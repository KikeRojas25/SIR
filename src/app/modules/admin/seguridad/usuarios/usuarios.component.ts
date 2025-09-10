import { Component, OnInit } from '@angular/core';
import { SeguridadService } from '../seguridad.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    TableModule, ButtonModule, InputTextModule, DialogModule,
    MatIconModule, DropdownModule, ToastModule,ConfirmDialogModule
  ],
  providers: [MessageService,ConfirmationService]
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];
  sucursales: any[] = [];
  criterio: string = '';

  mostrarModal = false;
  editando = false;

  model: any = {
    Id: null,
    nombre: '',
    apellido: '',
    usuarioRed: '',
    correo: '',
    idSucursal: null,
  };

  constructor(
    private seguridadService: SeguridadService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService 
  ) {}  

  ngOnInit(): void {
    this.buscarUsuarios();
    this.cargarSucursales();
  }

  // 🔍 Buscar usuarios
  buscarUsuarios() {
    this.seguridadService.listarUsuarios(this.criterio).subscribe((res) => {
      this.usuarios = res;
    });
  }

  // 📌 Cargar sucursales para el dropdown
  cargarSucursales() {
    this.seguridadService.listarSucursales().subscribe((res) => {
      this.sucursales = res.map((s: any) => ({
        idSucursal: s.idSucursal || s.id || 0,
        nombre: s.nombre || s.descripcion || 'Sin nombre'
      }));
    });
  }

  // 🟢 Nuevo usuario
  nuevo() {
    this.model = {
      Id: null,
      nombre: '',
      apellido: '',
      usuarioRed: '',
      correo: '',
      idSucursal: '',
    };
    this.editando = false;
    this.mostrarModal = true;
  }

  // ✏️ Editar usuario
  editar(usuario: any) {
    this.model = {
      Id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      usuarioRed: usuario.usuarioRed,
      correo: usuario.correo,
      idSucursal: usuario.idSucursal
    };
    this.editando = true;
    this.cargarSucursales();
    this.mostrarModal = true;
  }

  // ❌ Cancelar modal
  cancelar() {
    this.mostrarModal = false;
  }

  // 💾 Guardar (nuevo o edición)
// 💾 Guardar (nuevo o edición)
guardar() {
  const payload = {
    id: this.model.Id,
    usuarioRed: this.model.usuarioRed,
    nombre: this.model.nombre,
    apellido: this.model.apellido,
    correo: this.model.correo,
    usr_str_recordarpwd: "",
    usr_int_cambiarpwd: 0,
    bloqueado: 0,                  // int → 0/1
    aprobado: true,                // bool → true/false
    activo: 1,                     // int → 0/1
    ultimoLogin: null,             // nullables
    ultimoBloqueo: null,
    vencimientoPassword: null,
    numeroIntentos: 0,
    fechaRegistro: new Date().toISOString(),   // obligatorio en DTO
    sucursal: this.sucursales.find(s => s.idSucursal === this.model.idSucursal)?.nombre || "",
    tipoAcceso: null,
    idSucursal: this.model.idSucursal,
    numeroRoles: 0
  };

  console.log("Payload enviado:", payload);

  if (this.editando) {
    this.seguridadService.actualizarUsuario(payload).subscribe(() => {
      this.buscarUsuarios();
      this.mostrarModal = false;
      this.showSuccess("Usuario Actualizado con Éxito");
    });
  } else {
    this.seguridadService.registrarUsuario(payload).subscribe(() => {
      this.buscarUsuarios();
      this.mostrarModal = false;
      this.showSuccess("Usuario Registrado con Éxito");
    });
  }
}


  // 🗑 Eliminar usuario
eliminar(usuario: any) {
  this.confirmationService.confirm({
    message: `¿Seguro que quieres eliminar a este usuario: ${usuario.nombre} ${usuario.apellido}?`,
    header: 'Confirmar Eliminación',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Sí, eliminar',
    rejectLabel: 'Cancelar',
    acceptButtonStyleClass: 'p-button-danger',
    rejectButtonStyleClass: 'p-button-secondary',
    accept: () => {
      this.seguridadService.eliminarUsuario(usuario).subscribe(() => {
        // lo quita del frontend inmediatamente
        this.usuarios = this.usuarios.filter(u => u.id !== usuario.id);

        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Usuario eliminado con éxito',
          life: 3000
        });
      });
    }
  });
}


  // 🔔 Toast
  showSuccess(mensaje: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: mensaje,
      life: 3000
    });
  }
}
