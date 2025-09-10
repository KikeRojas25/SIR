import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-sucursal',
  templateUrl: './sucursal.component.html',
  styleUrls: ['./sucursal.component.css'],
  standalone: true,
  imports: [
    MatIcon, 
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    DropdownModule // 👈 importante para que funcione <p-dropdown>
  ]
})
export class SucursalComponent implements OnInit {
  model: any = {
    codigo: '',
    nombre: '',
    partner: null
  };

  partners = [
    { name: '--Todos--', value: null },
    { name: 'Hiper S.A', value: 'HIPER' },
    { name: 'Ingenico', value: 'INGENICO' },
    { name: 'ADQUIRENTE', value: 'ADQUIRENTE' },
    { name: 'FACILITADOR', value: 'FACILITADOR' },
    { name: 'Nexqo', value: 'NEXQO' }
  ];

  constructor() {}

  ngOnInit(): void {}

  buscar(): void {
    alert('hola');
  }
}
