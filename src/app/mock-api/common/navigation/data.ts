/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id   : '1',
        title: 'Importaciones',
        type : 'group',
        icon : 'heroicons_outline:chart-pie',
        link : '/example',
        children: [
            {
                id: 'dashboards.project',
                title: 'Seguimiento',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-document-check',
                link: '/dashboards/project',
            },
            {
                id: 'dashboards.analytics',
                title: 'Reportes',
                type: 'basic',
                icon: 'heroicons_outline:chart-pie',
                link: '/dashboards/analytics',
            }
           
        ],
    },
    {
        id   : '2',
        title: 'MRP',
        type : 'aside',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    },
    {
        id   : '3',
        title: 'Push Comercial',
        type : 'aside',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : '1',
        title: 'Maestros',
        type : 'aside',
        icon : 'heroicons_outline:chart-pie',
        link : '/example',
        children: [
            {
                id: '2',
                title: 'Cliente',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-document-check',
                link: '/importacionesoc/list',
            },
            {
                id: '3',
                title: 'Diagnóstico',
                type: 'basic',
                icon: 'heroicons_outline:chart-pie',
                link: '/dashboards/analytics',
            },
            {
                id: '3',
                title: 'Reparación',
                type: 'basic',
                icon: 'heroicons_outline:chart-pie',
                link: '/dashboards/analytics',
            },
            {
                id: '3',
                title: 'Almacén',
                type: 'basic',
                icon: 'heroicons_outline:chart-pie',
                link: '/dashboards/analytics',
            }
           
        ],
    },
    {
        id   : '2',
        title: 'Reparación',
        type : 'aside',
        icon : 'heroicons_outline:cog-6-tooth',
        link : '/reparacion',
        children: [
            {
                id: '1',
                title: 'Seguimiento',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-document-check',
                link: '/reparacion/list',
            },
            {
                id: '2',
                title: 'Panel Técnico',
                type: 'basic',
                icon: 'heroicons_outline:chart-pie',
                link: '/reparacion/panel',
            },
            {
                id: '3',
                title: 'QC',
                type: 'basic',
                icon: 'heroicons_outline:chart-pie',
                link: '/dashboards/analytics',
            }
           
        ],
    },
    {
        id   : '3',
        title: 'Recepción',
        type : 'aside',
        icon : 'heroicons_outline:chart-pie',
        link : '/cic',
        children: [
            {
                id: '1',
                title: 'Recepción de Guías',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-document-check',
                link: '/cic/masivocomprobantes',
            }
           
        ],
    },
    {
        id   : '4',
        title: 'Reportes',
        type : 'aside',
        icon : 'heroicons_outline:chart-bar',
        link : '/cic',
        children: [
            {
                id: '1',
                title: 'Base de Ingreso',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-document-check',
                link: '/venta360/shoppingcart',
            },
            {
                id: '2',
                title: 'Base Ingénico',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-document-check',
                link: '/venta360/shoppingcart',
            }
           
        ],
    }
];
