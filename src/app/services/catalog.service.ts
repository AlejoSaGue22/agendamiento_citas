import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Roles, TypeDocument } from '../auth/interfaces/user.interface';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private http = inject(HttpClient);

  getRoles(): Observable<Roles[]> {
    return this.http.get<Roles[]>(`${baseUrl}/users/roles/get`).pipe(
      map(res => res)
    );
  }

  getDocumentTypes(): Observable<TypeDocument[]> {
    return this.http.get<TypeDocument[]>(`${baseUrl}/users/document-types/get`).pipe(
      map(res => res)
    );
  }

  
}
