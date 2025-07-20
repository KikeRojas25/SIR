import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({    
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css'],
  standalone: true,
  imports: [RouterOutlet]
})
export class InventarioComponent {

  constructor() { }

}
