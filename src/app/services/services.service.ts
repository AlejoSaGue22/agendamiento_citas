import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../environments/environment.development';
import { Options, ResponseResult } from '../shared/interfaces/services.interfaces';
import { catchError, delay, map, Observable, of } from 'rxjs';
import { ServicioInterface, ServicioResponse } from '../modules/servicios/interfaces/servicios-interface';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  private http = inject(HttpClient);
  servicesRegistrados = signal<ServicioInterface[]>([]);
  // private servicesCache = new Map<string, ClientesResponse>();

    getServices(options: Options): Observable<ServicioResponse>{
        const { limit = 10, offset = 0 } = options;

        const key = `${limit}-${offset}`;

        // if (this.clientCache.has(key)) {
        //   return of(this.clientCache.get(key)!)
        // }

        return this.http.get<ServicioResponse>(`${baseUrl}/services`, {
            params: {
                limit,
                offset
            }
        }).pipe(
            delay(100),
            //  tap((client) => this.clientCache.set(key, client))
        )

    }

    actualizarService(id: string, service: Partial<ServicioInterface>){

        const serviceUpdate = service as ServicioInterface;

        return this.http.patch(`${baseUrl}/services/${id}`, serviceUpdate).pipe(
            map((service): ResponseResult => ({ success: true, data: service })),
            catchError((error: any): Observable<ResponseResult> => of({ success: false, error }))
        );
    }

    agregarService(service: Partial<ServicioInterface>): Observable<ResponseResult>{

        return this.http.post<ServicioInterface>(`${baseUrl}/services`, service).pipe(
            map((service): ResponseResult => ({ success: true, data: service })),
            catchError((error: any): Observable<ResponseResult> => of({ success: false, error}))
        );
    }                                                                                                                                                                                                                                                                                                                                                                                                                                                         

    deleteService(id: string): Observable<ResponseResult>{

        return this.http.delete<ServicioInterface>(`${baseUrl}/services/${id}`).pipe(
            map((service): ResponseResult => ({ success: true, data: service })),
            catchError((error: any): Observable<ResponseResult> => of({ success: false, error}))
        );
    }

}
