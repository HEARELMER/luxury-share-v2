export interface MenuNode {
  key: string;
  label: string;
  icon?: string;
  routerLink?: string;
  children?: MenuNode[];
  isNode?: boolean;
}
export const MENU_OPTIONS: MenuNode[] = [
  {
    key: 'home',
    label: 'Inicio',
    icon: 'pi pi-home',
    routerLink: '/home',
  },
  {
    key: 'users',
    label: 'Usuarios',
    routerLink: '/users',
    icon: 'pi pi-users',
    isNode: true,
    children: [
      {
        key: 'admins',
        label: 'Administradores',
        icon: 'pi pi-user',
        routerLink: '/users/admins',
      },
      {
        key: 'sellers',
        label: 'Vendedores',
        icon: 'pi pi-user',
        routerLink: '/users/sellers',
      },
      {
        key: 'gerents',
        label: 'Gerentes',
        icon: 'pi pi-user',
        routerLink: '/users/gerents',
      },
    ],
  },
  {
    key: 'clients',
    label: 'Clientes',
    icon: 'pi pi-user-plus',
    routerLink: '/clients',
  },
  {
    key: 'sales',
    label: 'Ventas',
    icon: 'pi pi-shopping-cart',
    routerLink: '/sales',
  },
  {
    key: 'services_packages',
    label: 'Paquetes y Servicios',
    icon: 'pi pi-box',
    routerLink: '/services_packages',
  }, 
  {
    key: 'reports',
    label: 'Reportes',
    icon: 'pi pi-chart-line',
    routerLink: '/reports',
  },
  {
    key: 'branches',
    label: 'Sucursales',
    icon: 'pi pi-building',
    routerLink: '/branches',
  },
  {
    key: 'configurations',
    label: 'Configuraciones',
    icon: 'pi pi-cog',
    routerLink: '/configurations',
  } 
];
