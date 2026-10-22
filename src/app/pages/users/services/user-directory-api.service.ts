import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { apiConfig } from '../../../core/config/api.config';
import {
  Employee,
  EmployeePage,
  EmployeeQuery,
  NewEmployee,
} from '../../../core/users/user-directory.models';

@Injectable({ providedIn: 'root' })
export class UserDirectoryApiService {
  private readonly http = inject(HttpClient);
  private readonly usersUrl = `${apiConfig.basePath}/users`;

  add(employee: NewEmployee): Observable<Employee> {
    return this.http.post<Employee>(this.usersUrl, employee);
  }

  deactivate(id: string): Observable<Employee> {
    return this.http.patch<Employee>(`${this.usersUrl}/${encodeURIComponent(id)}/deactivate`, {});
  }

  getPage(query: EmployeeQuery): Observable<EmployeePage> {
    const params = new HttpParams()
      .set('offset', query.offset)
      .set('limit', query.limit)
      .set('search', query.search)
      .set('status', query.status)
      .set('sortBy', query.sortBy)
      .set('sortDirection', query.sortDirection);

    return this.http.get<EmployeePage>(this.usersUrl, { params });
  }
}
