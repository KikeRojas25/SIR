import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

// Angular Material
import { MatIconModule } from '@angular/material/icon';

import { MaestroService } from '../maestro.service';
import { Partner, ValorTabla } from '../maestro.types';

@Component({
  selector: 'app-partner',
  standalone: true,
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CheckboxModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    MatIconModule
  ],
  providers: [MessageService, ConfirmationService]
})
export class PartnerComponent implements OnInit {
  partners: Partner[] = [];
  selectedPartner: Partner = {} as Partner;
  displayDialog = false;
  isNuevo = true;

  tiposPartner: ValorTabla[] = [];
  condicionesRecojo: ValorTabla[] = [];
  condicionesEntrega: ValorTabla[] = [];
  condicionesPago: ValorTabla[] = [];

  model = { ruc: '', razon: '' };

  constructor(
    private maestroService: MaestroService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.cargarCatalogos();
    this.buscar();
  }

  cargarCatalogos() {
    this.maestroService.getValoresTabla(39).subscribe(res => this.tiposPartner = res);
    this.maestroService.getValoresTabla(6).subscribe(res => this.condicionesRecojo = res);
    this.maestroService.getValoresTabla(6).subscribe(res => this.condicionesEntrega = res);
    this.maestroService.getValoresTabla(4).subscribe(res => this.condicionesPago = res);
  }

  buscar() {
    this.maestroService.getPartners(this.model.ruc, this.model.razon).subscribe({
      next: res => this.partners = res,
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar partners' })
    });
  }

  nuevo() {
    this.isNuevo = true;
    this.selectedPartner = {} as Partner;
    this.displayDialog = true;
  }

  editar(partner: Partner) {
    this.isNuevo = false;
    this.selectedPartner = { ...partner };
    this.displayDialog = true;
  }

  guardar() {
    if (this.isNuevo) {
      this.maestroService.registrarPartner(this.selectedPartner).subscribe(() => {
        this.buscar();
        this.displayDialog = false;
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Partner registrado' });
      });
    } else {
      this.maestroService.actualizarPartner(this.selectedPartner).subscribe(() => {
        this.buscar();
        this.displayDialog = false;
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Partner actualizado' });
      });
    }
  }

  eliminar(partner: Partner) {
    this.confirmationService.confirm({
      message: `Seguro que deseas eliminar al Partner: ${partner.razonSocial}`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.maestroService.eliminarPartner(partner.idPartner!).subscribe(() => {
          this.partners = this.partners.filter(p => p.idPartner !== partner.idPartner);
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Partner eliminado' });
        });
      }
    });
  }
}
