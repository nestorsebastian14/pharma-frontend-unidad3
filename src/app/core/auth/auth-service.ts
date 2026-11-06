import { computed, inject, Service, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, Permiso, Sesion } from './auth.model';

/** Clave con la que se guarda la sesión en sessionStorage. */
const CLAVE_SESION = 'pharmasoft.sesion';

@Service()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly url = `${environment.apiUrl}/auth`;

  private readonly sesionActual = signal<Sesion | null>(this.leerSesionGuardada());
  private temporizador?: ReturnType<typeof setTimeout>;
  private intervalId?: ReturnType<typeof setInterval>;

  readonly sesion = this.sesionActual.asReadonly();
  readonly autenticado = computed(() => this.sesionActual() !== null);

  readonly segundosRestantes = signal<number>(0);
  readonly porVencer = computed(() => {
    const sesion = this.sesionActual();
    return sesion !== null && this.segundosRestantes() > 0 && this.segundosRestantes() <= 120;
  });

  constructor() {
    const sesion = this.sesionActual();
    if (sesion) {
      this.programarExpiracion(sesion);
      this.iniciarCuentaRegresiva(sesion);
    }
  }

  login(credenciales: LoginRequest): Observable<Sesion> {
    return this.http.post<LoginResponse>(`${this.url}/login`, credenciales).pipe(
      map(r => ({
        token: r.token,
        expiraEn: Date.now() + r.expiraEnSegundos * 1000,
        username: r.username,
        nombreCompleto: r.nombreCompleto,
        roles: r.roles,
        permisos: r.permisos,
      })),
      tap(sesion => this.iniciar(sesion)),
    );
  }

  cerrarSesion(motivo?: 'expirada', volverA?: string): void {
    clearTimeout(this.temporizador);
    clearInterval(this.intervalId);
    this.segundosRestantes.set(0);
    sessionStorage.removeItem(CLAVE_SESION);
    this.sesionActual.set(null);

    const queryParams: Record<string, string> = {};
    if (motivo) queryParams['expirada'] = '1';
    if (volverA && volverA !== '/login') queryParams['returnUrl'] = volverA;
    void this.router.navigate(['/login'], { queryParams });
  }

  token(): string | null {
    const sesion = this.sesionActual();
    return sesion && Date.now() < sesion.expiraEn ? sesion.token : null;
  }

  tienePermiso(permiso: Permiso): boolean {
    return this.sesionActual()?.permisos.includes(permiso) ?? false;
  }

  // <-- MÉTODO NUEVO PARA LA PÁGINA MI CUENTA -->
  obtenerPerfil(): Observable<any> {
    return this.http.get<any>(`${this.url}/me`);
  }

  private iniciar(sesion: Sesion): void {
    sessionStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
    this.sesionActual.set(sesion);
    this.programarExpiracion(sesion);
    this.iniciarCuentaRegresiva(sesion);
  }

  private programarExpiracion(sesion: Sesion): void {
    clearTimeout(this.temporizador);
    const restante = sesion.expiraEn - Date.now();
    this.temporizador = setTimeout(
      () => this.cerrarSesion('expirada', this.router.url),
      Math.max(restante, 0),
    );
  }

  private iniciarCuentaRegresiva(sesion: Sesion): void {
    if (this.intervalId) clearInterval(this.intervalId);
    const restantes = Math.max(0, Math.floor((sesion.expiraEn - Date.now()) / 1000));
    this.segundosRestantes.set(restantes);
    this.intervalId = setInterval(() => {
      const s = Math.max(0, Math.floor((sesion.expiraEn - Date.now()) / 1000));
      this.segundosRestantes.set(s);
      if (s === 0) clearInterval(this.intervalId);
    }, 1000);
  }

  private leerSesionGuardada(): Sesion | null {
    try {
      const texto = sessionStorage.getItem(CLAVE_SESION);
      if (!texto) return null;
      const sesion = JSON.parse(texto) as Sesion;
      if (!sesion.token || Date.now() >= sesion.expiraEn) {
        sessionStorage.removeItem(CLAVE_SESION);
        return null;
      }
      return sesion;
    } catch {
      sessionStorage.removeItem(CLAVE_SESION);
      return null;
    }
  }
}