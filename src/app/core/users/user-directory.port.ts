import { Employee, EmployeePage, EmployeeQuery, NewEmployee } from './user-directory.models';

export interface UserDirectoryPort {
  add(employee: NewEmployee): Employee;
  deactivate(id: string): Employee;
  getAll(): readonly Employee[];
  getPage(query: EmployeeQuery): EmployeePage;
}
