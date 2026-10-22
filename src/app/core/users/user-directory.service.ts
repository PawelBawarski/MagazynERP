import { inject, Injectable, InjectionToken } from '@angular/core';

import { Employee, EmployeePage, EmployeeQuery, NewEmployee } from './user-directory.models';
import { UserDirectoryPort } from './user-directory.port';

export const USER_DIRECTORY_PORT = new InjectionToken<UserDirectoryPort>('USER_DIRECTORY_PORT');

@Injectable({ providedIn: 'root' })
export class UserDirectoryService {
  private readonly directory = inject(USER_DIRECTORY_PORT);

  add(employee: NewEmployee): Employee {
    return this.directory.add(employee);
  }

  deactivate(id: string): Employee {
    return this.directory.deactivate(id);
  }

  getAll(): readonly Employee[] {
    return this.directory.getAll();
  }

  getPage(query: EmployeeQuery): EmployeePage {
    return this.directory.getPage(query);
  }
}
