import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../environments/environment.development';
import { Options, ResponseResult } from '../shared/interfaces/services.interfaces';
import { catchError, delay, map, Observable, of } from 'rxjs';
import { ServicioInterface, ServicioResponse } from '../modules/servicios/interfaces/servicios-interface';
import { ClienteInterface, ClienteResponse } from '../modules/clientes/interfaces/clientes-interface';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private http = inject(HttpClient);
  clientesRegistrados = signal<ClienteInterface[]>([]);
  // private servicesCache = new Map<string, ClientesResponse>();

    getClientes(options: Options): Observable<ClienteResponse>{
        const { limit = 10, offset = 0 } = options;

        const key = `${limit}-${offset}`;

        // if (this.clientCache.has(key)) {
        //   return of(this.clientCache.get(key)!)
        // }

        return this.http.get<ClienteResponse>(`${baseUrl}/clients`, {
            params: {
                limit,
                offset
            }
        }).pipe(
            delay(100),
            //  tap((client) => this.clientCache.set(key, client))
        )

    }

    actualizarCliente(id: string, cliente: Partial<ClienteInterface>){

        const clienteUpdate = cliente as ClienteInterface;

        return this.http.patch(`${baseUrl}/clients/${id}`, clienteUpdate).pipe(
            map((cliente): ResponseResult => ({ success: true, data: cliente })),
            catchError((error: any): Observable<ResponseResult> => of({ success: false, error }))
        );
    }

    agregarCliente(cliente: Partial<ClienteInterface>): Observable<ResponseResult>{

        return this.http.post<ClienteInterface>(`${baseUrl}/clients`, cliente).pipe(
            map((cliente): ResponseResult => ({ success: true, data: cliente })),
            catchError((error: any): Observable<ResponseResult> => of({ success: false, error}))
        );
    }                                                                                                                                                                                                                                                                                                                                                                                                                                                         

    deleteCliente(id: string): Observable<ResponseResult>{

        return this.http.delete<ClienteInterface>(`${baseUrl}/clients/${id}`).pipe(
            map((cliente): ResponseResult => ({ success: true, data: cliente })),
            catchError((error: any): Observable<ResponseResult> => of({ success: false, error}))
        );
    }

}