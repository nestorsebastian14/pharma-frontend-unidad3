import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';
import { AvisoSesion } from '../../shared/components/aviso-sesion/aviso-sesion';
@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Header, Sidebar, AvisoSesion],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  protected readonly menuColapsado = signal(false);
  alternarMenu(): void {
    this.menuColapsado.update(valor => !valor);
  }
}