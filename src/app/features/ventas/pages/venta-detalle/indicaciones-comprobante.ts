import { Component } from '@angular/core';

/** Texto auxiliar no crítico: descargado únicamente al estar visible. */
@Component({
  selector: 'app-indicaciones-comprobante',
  standalone: true,
  template: `<p class="no-imprimir" style="margin-top:1rem;color:#526173;font-size:.875rem">
    Revise los datos antes de imprimir. El comprobante es un documento interno sin valor tributario.
  </p>`,
})
export class IndicacionesComprobante {}
