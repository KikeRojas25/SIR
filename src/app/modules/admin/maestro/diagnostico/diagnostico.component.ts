import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-diagnostico',
  templateUrl: './diagnostico.component.html',
  styleUrls: ['./diagnostico.component.css'],
  standalone: true,
  imports: [MatIcon, CommonModule, FormsModule, ButtonModule, DropdownModule]
})
export class DiagnosticoComponent implements OnInit {

  categorias: any[] = [];
  categoriaSeleccionada: any = null;

  constructor() { }

  ngOnInit(): void {
    this.categorias = [
      { label: '[--]', value: null },
      { label: 'General', value: 'General' },
      { label: 'Key mat', value: 'Key mat' },
      { label: 'Printer', value: 'Printer' },
      { label: 'Display', value: 'Display' },
      { label: 'Mag Stripe Reader', value: 'Mag Stripe Reader' },
      { label: 'Smart Card Reader', value: 'Smart Card Reader' },
      { label: 'SIM / SAM Card Reader', value: 'SIM / SAM Card Reader' },
      { label: 'External Battery', value: 'External Battery' },
      { label: 'Electronic Board PCBA', value: 'Electronic Board PCBA' },
      { label: 'Interface / COM Port', value: 'Interface / COM Port' },
      { label: 'Software', value: 'Software' },
      { label: 'GSM / GPRS / CDMA', value: 'GSM / GPRS / CDMA' },
      { label: 'CPEM / Contactless Card Reader', value: 'CPEM / Contactless Card Reader' },
      { label: 'Housing / Structure', value: 'Housing / Structure' },
      { label: 'Labels', value: 'Labels' }
    ];
  }

  buscar(): void {
    alert('Buscando con categoría: ' + (this.categoriaSeleccionada?.label || 'Todas'));
  }
}
