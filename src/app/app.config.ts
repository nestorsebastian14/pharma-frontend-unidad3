import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding, withPreloading, PreloadAllModules } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { errorInterceptor } from './core/interceptors/error-interceptor';

// Por defecto no se precargan rutas: evita descargar módulos que el cajero no usa.
// Para comparar en la sesión 13, cambiar a true y repetir el mismo protocolo de medición.
const PRECARGAR_TODAS_LAS_RUTAS = false;

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding(),
      ...(PRECARGAR_TODAS_LAS_RUTAS ? [withPreloading(PreloadAllModules)] : [])),
    // El orden importa: primero se agrega el token, luego se atienden los errores.
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
  ],
};
