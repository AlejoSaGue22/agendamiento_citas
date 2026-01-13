import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../environments/environment.development';
import { catchError, delay, map, Observable, of } from 'rxjs';
import { PersonalInterface, PersonalResponse } from '../modules/personal/interfaces/personal-interface';
import { Options, ResponseResult } from '../shared/interfaces/services.interfaces';

const baseUrl = environment.baseUrl;

const formEmpty: PersonalInterface = {
    id: '',
    full_name: '',  
    name_user: '',
    last_name: '',
    phone: '',
    role_id: 0,
    role_name: '',
    number_document: '',
    type_document: '',
    is_active: false,
    email: '',
    availability: [],
    services: [],
    created_at: '',
};


@Injectable({
  providedIn: 'root'
})
export class PersonalService {

  private http = inject(HttpClient);
  usersRegistrados = signal<PersonalInterface[]>([]);
  // private servicesCache = new Map<string, ClientesResponse>();

    getUsers(options: Options): Observable<PersonalResponse>{
        const { limit = 10, offset = 0 } = options;

        const key = `${limit}-${offset}`;

        // if (this.clientCache.has(key)) {
        //   return of(this.clientCache.get(key)!)
        // }

        return this.http.get<PersonalResponse>(`${baseUrl}/users`, {
            params: {
                limit,
                offset
            }
        }).pipe(
            delay(100),
            //  tap((client) => this.clientCache.set(key, client))
        )

    }

    getUserById(id: string): Observable<ResponseResult> {
        if (id == 'new') {
            return of({ success: true,  data: formEmpty });
        }

        return this.http.get<PersonalInterface>(`${baseUrl}/users/${id}`).pipe(
            map((user): ResponseResult => ({ success: true, data: user })),
            catchError((error: any): Observable<ResponseResult> => of({ success: false, error}))
        );
    }

    actualizarUser(id: string, user: Partial<PersonalInterface>){

        const userUpdate = user as PersonalInterface;

        return this.http.patch(`${baseUrl}/users/${id}`, userUpdate).pipe(
            map((user): ResponseResult => ({ success: true, data: user })),
            catchError((error: any): Observable<ResponseResult> => of({ success: false, error }))
        );
    }

    agregarUser(user: Partial<PersonalInterface>): Observable<ResponseResult>{

        return this.http.post<PersonalInterface>(`${baseUrl}/users`, user).pipe(
                map((user): ResponseResult => ({ success: true, data: user })),
                catchError((error: any): Observable<ResponseResult> => of({ success: false, error}))
            );
    }                                                                                                                                                                                                                                                                                                                                                                                                                                                         

    deleteUser(id: string): Observable<ResponseResult>{

        return this.http.delete<PersonalInterface>(`${baseUrl}/users/${id}`).pipe(
            map((user): ResponseResult => ({ success: true, data: user })),
            catchError((error: any): Observable<ResponseResult> => of({ success: false, error}))
        );
    }

}
