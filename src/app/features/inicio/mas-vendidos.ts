import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';

interface ProductoMasVendido {
  productoId: number;
  productoNombre: string;
  categoriaNombre: string;
  cantidadVendida: number;
  montoTotal: number;
}

@Component({
  selector: 'app-mas-vendidos',
  imports: [CurrencyPipe],
  templateUrl: './mas-vendidos.html',
})
export class MasVendidos {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/reportes/productos-mas-vendidos`;

  protected readonly filas = toSignal(
    this.http
      .get<ProductoMasVendido[]>(this.url)
      .pipe(catchError(() => of([] as ProductoMasVendido[]))),
    { initialValue: [] as ProductoMasVendido[] },
  );
}
