import { Component, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
  standalone: true,
  imports: [MatIcon]
})
export class ClienteComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
