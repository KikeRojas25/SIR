import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/example'
    {path: '', pathMatch : 'full', redirectTo: 'example'},

    // Redirect signed-in user to the '/example'
    //
    // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'example'},

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.routes')},
            {path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.routes')},
            {path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.routes')},
            {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.routes')},
            {path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.routes')}
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.routes')},
            {path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.routes')}
        ]
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'home', loadChildren: () => import('app/modules/landing/home/home.routes')},
        ]
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {
                path: 'example',
                loadComponent: () => import('app/modules/admin/example/example.component')
                  .then(m => m.ExampleComponent)
            },
            {
                path: 'importacionesoc',
                loadComponent: () => import('./modules/admin/importacionesoc/importacionesoc.component')
                                      .then(m => m.ImportacionesocComponent),
                children: [
                  {
                    path: 'list',
                    loadComponent: () => import('./modules/admin/importacionesoc/list/list.component')
                                          .then(m => m.ListComponent)
                  },
                //   {
                //     path: 'details/:id',
                //     loadComponent: () => import('./modules/admin/comercio/details/details.component')
                //                           .then(m => m.DetailsComponent)
                //   }
                ]
              },
              {
                path: 'recepcion',
                loadComponent: () => import('./modules/admin/cic/cic.component')
                                      .then(m => m.CicComponent),
                children: [
                  {
                    path: 'masivocomprobantes',
                    loadComponent: () => import('./modules/admin/cic/masivocomprobantes/masivocomprobantes.component')
                                          .then(m => m.MasivocomprobantesComponent)
                  },
                  {
                    path: 'panel',
                    loadComponent: () => import('./modules/admin/cic/panelrecepcion/panelrecepcion.component')
                                          .then(m => m.PanelrecepcionComponent)
                  },
                                    {
                    path: 'recepcionxguia',
                    loadComponent: () => import('./modules/admin/cic/recepcionxguia/recepcionxguia.component')
                                          .then(m => m.RecepcionxguiaComponent)
                  },
                ]
              },
              {
                path: 'reparacion',
                loadComponent: () => import('./modules/admin/reparacion/reparacion.component')
                                      .then(m => m.ReparacionComponent),
                children: [
                  {
                    path: 'list',
                    loadComponent: () => import('./modules/admin/reparacion/list/list.component')
                                          .then(m => m.ListComponent)
                  },
                  {
                    path: 'panel',
                    loadComponent: () => import('./modules/admin/reparacion/panel/panel.component')
                                          .then(m => m.PanelComponent)
                  },
                  {
                    path: 'detallepanel/:uid',
                    loadComponent: () => import('./modules/admin/reparacion/detallepanel/detallepanel.component')
                                          .then(m => m.DetallepanelComponent)
                  },
                  {
                    path: 'qc',
                    loadComponent: () => import('./modules/admin/reparacion/controlcalidad/controlcalidad.component')
                                          .then(m => m.ControlcalidadComponent)
                  }
                ]
              },
               {
                path: 'inventario',
                loadComponent: () => import('./modules/admin/inventario/inventario.component')
                                      .then(m => m.InventarioComponent),
                children: [
                  {
                    path: 'operacionesinventario',
                    loadComponent: ()   => import('./modules/admin/inventario/operacionesinventario/operacionesinventario.component')
                                          .then(m => m.OperacionesinventarioComponent)
                  },
                  {
                    path: 'ordendeingreso',
                    loadComponent: () => import('./modules/admin/inventario/ordeningreso/ordeningreso.component')
                                          .then(m => m.OrdeningresoComponent)
                  },
                ]
              },
              {
                path: 'reportes',
                loadComponent: () => import('./modules/admin/reportes/reportes.component')
                                      .then(m => m.ReportesComponent),
                children: [
                  {
                    path: 'baseingreso',
                    loadComponent: () => import('./modules/admin/reportes/baseingreso/baseingreso.component')
                                          .then(m => m.BaseingresoComponent)
                  },
                  {
                    path: 'baseingenico',
                    loadComponent: () => import('./modules/admin/reportes/baseingenico/baseingenico.component')
                                          .then(m => m.BaseingenicoComponent)
                  },
                  {
                    path: 'poroperador',
                    loadComponent: () => import('./modules/admin/reportes/reporteporoperador/reporteporoperador.component')
                                          .then(m => m.ReporteporoperadorComponent)
                  }
                 
                ]
              },
{
                path: 'maestro',
                loadComponent: () => import('./modules/admin/maestro/maestro.component')
                                      .then(m => m.MaestroComponent),
                children: [
                  {
                    path: 'cliente',
                    loadComponent: () => import('./modules/admin/maestro/cliente/cliente.component')
                                          .then(m => m.ClienteComponent)
                  },
                  {
                        path: 'partner',
                  loadComponent: () =>
                                          import('./modules/admin/maestro/partner/partner.component')
                  .then(m => m.PartnerComponent)
                  },
                  {
                    path: 'zona',
                    loadComponent: () => import('./modules/admin/maestro/zona/zona.component')
                                          .then(m => m.ZonaComponent)
                  },
                  {
                    path: 'sucursal',
                    loadComponent: () => import('./modules/admin/maestro/sucursal/sucursal.component')
                                          .then(m => m.SucursalComponent)
                  },
                  {
                    path: 'diagnostico',
                    loadComponent: () => import('./modules/admin/maestro/diagnostico/diagnostico.component')
                                          .then(m => m.DiagnosticoComponent)
                  },
                  {
                    path: 'reparacion',
                    loadComponent: () => import('./modules/admin/maestro/reparacion/reparacion.component')
                                          .then(m => m.ReparacionComponent)
                  },
                  {
                    path: 'producto',
                    loadComponent: () => import('./modules/admin/maestro/producto/producto.component')
                                          .then(m => m.ProductoComponent)
                  },
                  {
                    path: 'valortabla',
                    loadComponent: () => import('./modules/admin/maestro/valortabla/valortabla.component')
                                          .then(m => m.ValortablaComponent)
                  },
                  {
                    path: 'almacen',
                    loadComponent: () => import('./modules/admin/maestro/almacen/almacen.component')
                                          .then(m => m.AlmacenComponent)
                  },
                ]
              },
              {
                path: 'seguridad',
                loadComponent: () => import('./modules/admin/seguridad/seguridad.component')
                                      .then(m => m.SeguridadComponent),
                children: [
                  {
                    path: 'usuarios',
                    loadComponent: () => import('./modules/admin/seguridad/usuarios/usuarios.component')
                                          .then(m => m.UsuariosComponent)
                  }
                ]}
        ]
    }
];
