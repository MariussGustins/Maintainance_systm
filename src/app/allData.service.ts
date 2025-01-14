import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, forkJoin, tap} from 'rxjs';
import { map } from 'rxjs/operators';
import {Employee, EmployeeIdent, EmployeeWithIdentDTO, Files, Project} from './allData.interface';

@Injectable({
  providedIn: 'root'
})
export class AllDataService {
  private apiUrl = 'http://localhost:5086/api';

  constructor(private http: HttpClient) {}

  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/Employee`).pipe(
      tap(employees => console.log('Employees fetched:', employees)) // Log the response
    );
  }

  getAllEmployeesIdent(): Observable<EmployeeIdent[]> {
    return this.http.get<EmployeeIdent[]>(`${this.apiUrl}/EmployeeIdent`).pipe(
      tap(idents => console.log('Employee Idents fetched:', idents)) // Log the response
    );
  }

  getAllEmployeesWithIdents(): Observable<EmployeeWithIdentDTO[]> {
    return this.http.get<EmployeeWithIdentDTO[]>(`${this.apiUrl}/Employee/combined`);
  }
  getFilesByEmployeeId(employeeId: number): Observable<Files[]> {
    return this.http.get<Files[]>(`${this.apiUrl}/Files/by-employee/${employeeId}`).pipe(
      tap((files) => console.log(`Files fetched for Employee ID ${employeeId}:`, files))
    );
  }
  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/Projects`).pipe(
      tap((projects) => console.log('Projects fetched:', projects))
    );
  }

  getEmployeeById(employeeId: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/Employee/${employeeId}`).pipe(
      tap(employee => console.log(`Employee fetched for ID ${employeeId}:`, employee))
    );
  }


}
