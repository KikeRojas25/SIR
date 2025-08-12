import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-maestro',
  templateUrl: './maestro.component.html',
  styleUrls: ['./maestro.component.css'],
  standalone: true,
  imports: [RouterOutlet]
})
export class MaestroComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
