import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-zona',
  templateUrl: './zona.component.html',
  styleUrls: ['./zona.component.css'],
  standalone: true,
  imports: [
    MatIcon,
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule
  ]
})
export class ZonaComponent implements OnInit {
  model: any = {};

  constructor() {}

  ngOnInit(): void {}

  buscar(): void {
    alert("hola");
  }
} 
