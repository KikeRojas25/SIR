import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-reparacion',
  templateUrl: './reparacion.component.html',
  styleUrls: ['./reparacion.component.css'],
  standalone: true,
  imports:[
    RouterOutlet
  ]
})
export class ReparacionComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
