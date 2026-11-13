import { Component, computed, input, output } from '@angular/core';
@Component({selector:'app-paginador',templateUrl:'./paginador.html',styleUrl:'./paginador.css'})
export class Paginador {
 readonly pagina=input.required<number>(); readonly totalPaginas=input.required<number>();
 readonly totalElementos=input.required<number>(); readonly tamanio=input.required<number>();
 readonly tamanios=input<number[]>([10,20,50]);
 readonly cambioPagina=output<number>();readonly cambioTamanio=output<number>();
 protected readonly desde=computed(()=>this.totalElementos()===0?0:this.pagina()*this.tamanio()+1);
 protected readonly hasta=computed(()=>Math.min((this.pagina()+1)*this.tamanio(),this.totalElementos()));
 protected readonly primera=computed(()=>this.pagina()===0);
 protected readonly ultima=computed(()=>this.pagina()>=this.totalPaginas()-1);
 protected ir(n:number){if(n>=0 && n<this.totalPaginas() && n!==this.pagina())this.cambioPagina.emit(n);}
}
