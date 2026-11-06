import { Component, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/auth/auth-service';

@Component({
  selector: 'app-aviso-sesion',
  imports: [],
  templateUrl: './aviso-sesion.html',
  styleUrl: './aviso-sesion.css',
})
export class AvisoSesion {
  private readonly auth = inject(AuthService);
  protected readonly oculto = signal(false);

  // Muestra el aviso solo si está por vencer y el usuario no lo ha cerrado
  protected readonly mostrarAviso = computed(() => 
    this.auth.porVencer() && !this.oculto()
  );

  // Formatea los segundos a mm:ss (ej. 01:47)
  protected readonly tiempoFormateado = computed(() => {
    const total = this.auth.segundosRestantes();
    const minutos = Math.floor(total / 60);
    const segundos = total % 60;
    return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
  });

  cerrarSesionAhora(): void {
    this.auth.cerrarSesion();
  }

  ocultarAviso(): void {
    this.oculto.set(true);
  }
}