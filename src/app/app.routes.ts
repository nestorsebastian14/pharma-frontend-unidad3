import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { authGuard, invitadoGuard } from './core/guards/auth-guard';
import { permisoGuard } from './core/guards/permiso-guard';

export const routes: Routes = [
  // Pública: fuera del layout y solo para quien no inició sesión
  {
    path: 'login',
    title: 'Iniciar sesión',
    canActivate: [invitadoGuard],
    loadComponent: () => import('./features/auth/pages/login/login').then(m => m.Login),
  },
  // Privadas: todo lo que cuelga del layout exige sesión
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'inicio' },
      {
        path: 'inicio',
        title: 'Inicio',
        loadComponent: () => import('./features/inicio/inicio').then(m => m.Inicio),
      },
      {
        path: 'categorias',
        canActivate: [permisoGuard],
        data: { permiso: 'CATALOGO_LEER' },
        loadChildren: () =>
          import('./features/categorias/categorias.routes').then(m => m.CATEGORIAS_ROUTES),
      },
      {
        path: 'productos',
        canActivate: [permisoGuard],
        data: { permiso: 'CATALOGO_LEER' },
        loadChildren: () =>
          import('./features/productos/productos.routes').then(m => m.PRODUCTOS_ROUTES),
      },
      {
        path: 'ventas',
        canActivate: [permisoGuard],
        data: { permiso: 'VENTAS_LEER' },
        loadChildren: () =>
          import('./features/ventas/ventas.routes').then(m => m.VENTAS_ROUTES),
      },
      {
        path: 'clientes',
        canActivate: [permisoGuard],
        data: { permiso: 'CLIENTES_LEER' },
        loadChildren: () =>
          import('./features/clientes/clientes.routes').then(m => m.CLIENTES_ROUTES),
      },
      // <-- NUEVA RUTA AGREGADA -->
      {
        path: 'mi-cuenta',
        title: 'Mi cuenta',
        loadComponent: () => import('./features/auth/pages/mi-cuenta/mi-cuenta').then(m => m.MiCuenta),
      },
      {
        path: 'acceso-denegado',
        title: 'Acceso denegado',
        loadComponent: () =>
          import('./shared/pages/acceso-denegado/acceso-denegado').then(m => m.AccesoDenegado),
      },
    ],
  },
  {
    path: '**',
    title: 'Página no encontrada',
    loadComponent: () =>
      import('./shared/pages/no-encontrado/no-encontrado').then(m => m.NoEncontrado),
  },
];