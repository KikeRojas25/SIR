import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ReparacionService } from '../reparacion.service';

@Component({
    selector: 'app-panel',
    templateUrl: './panel.component.html',
    styleUrls: ['./panel.component.css'],
    standalone: true,
    imports: [
        FormsModule,
        CommonModule,
        MatIcon,
        CalendarModule,
        DropdownModule,
        InputTextModule,
        ButtonModule,
        TableModule,
        DialogModule,
        ToastModule,
        ConfirmDialogModule,
    ],
    providers: [DialogService, MessageService, ConfirmationService],
})
export class PanelComponent implements OnInit {
    model: any = {};
    estados: SelectItem[] = [];
    cols: any[];
    ordenes: any[];
    visible = false;
    ordenSelected: any;
    userId: number;
    jwtHelper = new JwtHelperService();
    decodedToken: any = {};

    constructor(
        private reparacionService: ReparacionService,
        private messageService: MessageService,
        private router: Router
    ) {}

    ngOnInit() {
        const user = localStorage.getItem('token');
        this.decodedToken = this.jwtHelper.decodeToken(user);
        this.userId = this.decodedToken.nameid;

        this.cols = [
            {
                header: 'ORDEN SERVICIO',
                backgroundcolor: '#125ea3',
                field: 'tiOrdeComp',
                width: '120px',
            },
            {
                header: 'PRODUCTO',
                backgroundcolor: '#125ea3',
                field: 'nuOrdeComp',
                width: '120px',
            },
            {
                header: 'SERIE',
                backgroundcolor: '#125ea3',
                field: 'stOrde',
                width: '220px',
            },
            {
                header: 'ESTADO',
                backgroundcolor: '#125ea3',
                field: 'otestado',
                width: '120px',
            },
            {
                header: 'SUCURSAL',
                backgroundcolor: '#125ea3',
                field: 'otestado',
                width: '120px',
            },
            {
                header: 'FEC. ASIGNACIÓN',
                backgroundcolor: '#125ea3',
                field: 'deRubr',
                width: '120px',
            },
            {
                header: 'TEC. ASIGNADO',
                backgroundcolor: '#125ea3',
                field: 'deRubr',
                width: '120px',
            },
            {
                header: 'ASIGNAR',
                backgroundcolor: '#125ea3',
                field: 'deRubr',
                width: '120px',
            },
        ];

        this.model.dateinicio = new Date();
        this.model.datefin = new Date();

        this.model.dateinicio.setMonth(this.model.dateinicio.getMonth() - 1);

        this.cargarDropdownList();
    }
    cargarDropdownList() {
        this.reparacionService.getEstados(77).subscribe((data) => {
            
            this.estados = data.map((estado: any) => ({
                value: estado.idestado,
                label: estado.estado,
            }));
            this.estados.unshift({
                value: null,
                label: 'Selecciona un estado',
            });
        });

        this.buscar();
    }
    buscar() {
        const fecini = this.model.dateinicio
            ? this.model.dateinicio.toISOString().split('T')[0]
            : null;
        const fecfin = this.model.datefin
            ? this.model.datefin.toISOString().split('T')[0]
            : null;

        this.reparacionService
            .listarOrdenServicioTecnico(
                this.model.os,
                this.userId,
                fecini,
                fecfin,
                this.model.idestado,
                this.model.serie
            )
            .subscribe((data) => {
                this.ordenes = data;
            });
    }
    iniciar(rowData: any) {
        this.ordenSelected = rowData;

        const estado = rowData.otestado?.toString().trim();

        if (!estado) {
            // Caso: estado nulo, undefined o vacío => abrir popup
            this.visible = true;
        } else {
            // Caso: estado definido => ir al detalle

            const body = {
                Id: rowData.idOrdenTrabajo,
                IdUsuario: this.userId, // Asegúrate de tener el ID del usuario logueado
            };

            this.reparacionService.iniciarReparacion(body).subscribe({
                next: (res) => {
                    // Si todo va bien, redirige al detalle
                    this.router.navigate([
                        '/reparacion/detallepanel',
                        rowData.idordenserviciotecnico,
                    ]);
                },
                error: (err) => {
                    
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'No se pudo iniciar la reparación.',
                    });
                },
            });

            this.router.navigate([
                '/reparacion/detallepanel',
                rowData.idordenserviciotecnico,
            ]);
        }
    }
    confirmarAsignacion() {
        

        this.reparacionService
            .asignarOrdenTrabajo(
                this.ordenSelected.idordenserviciotecnico,
                this.userId
            )
            .subscribe((resp) => {
                this.buscar();

                this.messageService.add({
                    severity: 'success',
                    summary: 'Asignado',
                    detail: 'Se ha asignado correctamente.',
                    life: 3000,
                });
            });
    }
    getEstadoClass(estado: string): string {
        switch (estado) {
            case 'Detenida':
                return 'estado-detenida';
            case 'En Atención':
                return 'estado-atencion';
            case 'Completada':
                return 'estado-completada';
            case 'Pendiente':
                return 'estado-pendiente';
            default:
                return 'estado-default';
        }
    }
}
