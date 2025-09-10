import { Component, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-tarifa',
  templateUrl: './tarifa.component.html',
  styleUrls: ['./tarifa.component.css'],
  standalone: true,
  imports: [MatIcon]
})
export class TarifaComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
