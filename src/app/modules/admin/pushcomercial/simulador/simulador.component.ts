import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { SelectItem } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { ImportacionesocService } from '../../importacionesoc/importacionesoc.service';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { PushcomercialService } from '../pushcomercial.service';

@Component({
  selector: 'app-simulador',
  templateUrl: './simulador.component.html',
  styleUrls: ['./simulador.component.css'],
  standalone: true,
  imports:[
    CommonModule,
    FormsModule,
    MatIcon,
    DropdownModule,
    InputTextModule, 
    CalendarModule

  ]


})
export class SimuladorComponent implements OnInit {
 
  date: Date | undefined;
  rubros: SelectItem[] = [];
  familias: SelectItem[] = [];
  subfamilias: SelectItem[] = [];

  selectedRubro: any;
  selectedFamilia: any;
  selectedSubfamilia: any;

  model: any = {};


  constructor(private importacionesOcService: ImportacionesocService,
   private pushComercialService: PushcomercialService
  ) { }

  ngOnInit() {

    this.cargarRubros();
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
  this.model.CodFamilia = null;


  if (this.model.CodRubro) {
    this.importacionesOcService.getFamilias(this.model.CodRubro).subscribe({
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

  if (this.model.CodFamilia) {
    this.importacionesOcService.getSubfamilias(this.model.CodFamilia).subscribe({
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
  this.pushComercialService.getPushComercial(this.model.dateinicio,
    this.model.datefin, this.model.acotado, this.model.sku).subscribe(resp =>  {

      console.log('pushcomercial:', resp);

    });
}


}
