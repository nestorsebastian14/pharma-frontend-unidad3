import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { catchError, map, of, switchMap } from 'rxjs';
import { mensajeError } from '../../../../core/utils/http-error';
import { Cliente } from '../../../clientes/models/cliente.model';
import { ClienteService } from '../../../clientes/services/cliente-service';
import { Venta } from '../../models/venta.model';
import { VentaService } from '../../services/venta-service';
import { IndicacionesComprobante } from './indicaciones-comprobante';

@Component({
  selector: 'app-venta-detalle',
  imports: [RouterLink, CurrencyPipe, DatePipe, IndicacionesComprobante],
  templateUrl: './venta-detalle.html',
  styleUrl: './venta-detalle.css',
})
export class VentaDetalle implements OnInit {
  private readonly ventaService = inject(VentaService);
  private readonly clienteService = inject(ClienteService);

  readonly id = input.required<string>();
  /** Llega como ?nueva=1 después de registrar. */
  readonly nueva = input<string>();
  /** Llega como ?imprimir=1 cuando se pide imprimir al abrir. */
  readonly imprimir = input<string>();

  protected readonly venta = signal<Venta | null>(null);
  protected readonly cliente = signal<Cliente | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly fechaImpresion = new Date();

  /** Número con ceros a la izquierda: 4 → "000004". */
  protected readonly numero = computed(() => String(this.venta()?.id ?? '').padStart(6, '0'));
  protected readonly unidades = computed(() =>
    (this.venta()?.detalles ?? []).reduce((suma, d) => suma + d.cantidad, 0));

  ngOnInit(): void {
    this.ventaService.obtener(Number(this.id())).pipe(
      // El DNI no viene en la venta: se pide el cliente. Si falla, el comprobante sale sin DNI.
      switchMap(venta => this.clienteService.obtener(venta.clienteId).pipe(
        catchError(() => of(null)),
        map(cliente => ({ venta, cliente })),
      )),
    ).subscribe({
      next: ({ venta, cliente }) => {
        this.venta.set(venta);
        this.cliente.set(cliente);
        // Se espera a que Angular pinte el comprobante antes de abrir el diálogo de impresión.
        if (this.imprimir()) setTimeout(() => window.print(), 300);
      },
      error: (err: HttpErrorResponse) => this.error.set(mensajeError(err)),
    });
  }

  protected imprimirComprobante(): void {
    window.print();
  }
}
