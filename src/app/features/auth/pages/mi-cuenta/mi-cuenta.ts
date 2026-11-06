import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/auth/auth-service';

@Component({
  selector: 'app-mi-cuenta',
  imports: [CommonModule],
  templateUrl: './mi-cuenta.html',
  styleUrl: './mi-cuenta.css',
})
export class MiCuenta implements OnInit {
  private readonly auth = inject(AuthService);

  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly perfil = signal<any>(null);
  protected readonly permisosCambiaron = signal(false);

  ngOnInit(): void {
    this.auth.obtenerPerfil().subscribe({
      next: (data) => {
        this.perfil.set(data);
        this.cargando.set(false);

        const sesion = this.auth.sesion();
        if (sesion && sesion.permisos) {
          const permisosServidor = [...data.permisos].sort().join(',');
          const permisosSesion = [...sesion.permisos].sort().join(',');
          if (permisosServidor !== permisosSesion) {
            this.permisosCambiaron.set(true);
          }
        }
      },
      error: () => {
        this.error.set('No se pudo cargar la información del perfil.');
        this.cargando.set(false);
      }
    });
  }
}