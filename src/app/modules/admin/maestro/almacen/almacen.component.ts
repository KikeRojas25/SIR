import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MatIcon } from '@angular/material/icon';

interface Almacen {
  codigo: string;
  nombre: string;
  sucursal: string;
  tipo: string;
}

@Component({
  selector: 'app-almacen',   // 🔹 singular
  templateUrl: './almacen.component.html',  // 🔹 cambia también el nombre del html
  styleUrls: ['./almacen.component.css'],   // 🔹 idem con css
  standalone: true,
  imports: [MatIcon,CommonModule, FormsModule, TableModule, DropdownModule, ButtonModule, InputTextModule],
})
export class AlmacenComponent implements OnInit {   // 🔹 singular
  
  codigoAlmacen: string = '';
  sucursalSeleccionada: any = null;

  sucursales = [
    { label: '[-]', value: null },
    { label: 'Sucursal', value: 'Sucursal' },
    { label: 'Almacén Perú', value: 'Almacén Perú' },
    { label: 'Almacén Chile', value: 'Almacén Chile' },
    { label: 'Almacén Argentina', value: 'Almacén Argentina' },
  ];

  almacen: Almacen[] = [
    { codigo: 'LabPe', nombre: 'Perú Almacén', sucursal: 'Almacén Perú', tipo: 'Físico' },
    { codigo: 'CHLab', nombre: 'Almacén Chile', sucursal: 'Almacén Chile', tipo: 'Físico' },
    { codigo: 'LABARG', nombre: 'Almacén Argentina', sucursal: 'Almacén Argentina', tipo: 'Físico' },
  ];

  almacenFiltrado: Almacen[] = [];

  ngOnInit() {
    this.almacenFiltrado = [...this.almacen];
  }

  buscar() {
    this.almacenFiltrado = this.almacen.filter(a => {
      const matchCodigo = this.codigoAlmacen ? a.codigo.toLowerCase().includes(this.codigoAlmacen.toLowerCase()) : true;
      const matchSucursal = this.sucursalSeleccionada ? a.sucursal === this.sucursalSeleccionada : true;
      return matchCodigo && matchSucursal;
    });
  }

  nuevo() {
    console.log('Nuevo almacén');
  }

  editar(item: Almacen) {
    console.log('Editar almacén', item);
  }

  eliminar(item: Almacen) {
    console.log('Eliminar almacén', item);
    this.almacen = this.almacen.filter(a => a.codigo !== item.codigo);
    this.buscar();
  }
}
