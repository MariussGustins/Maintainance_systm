import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, forkJoin, tap} from 'rxjs';
import { map } from 'rxjs/operators';
import {Employee, EmployeeIdent, EmployeeWithIdentDTO,EmployeeRoles, Files, Project} from './allData.interface';

@Injectable({
  providedIn: 'root'
})
export class AllDataService {
  public apiUrl = 'http://localhost:5086/api';

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
  uploadFile(formData: FormData): Observable<any> {
    return this.http.post<Files[]>(`${this.apiUrl}/Files`, formData);
  }
  downloadFile(filePath: string): string {
    return `${this.apiUrl}/Files/download?filePath=${encodeURIComponent(filePath)}`;
  }


  getAllEmployeesWithIdents(): Observable<EmployeeWithIdentDTO[]> {
    return this.http.get<EmployeeWithIdentDTO[]>(`${this.apiUrl}/Employee/combined`);
  }
  getFilesByEmployeeId(employeeId: number): Observable<Files[]> {
    return this.http.get<Files[]>(`${this.apiUrl}/Files/by-employee/${employeeId}`).pipe(
      tap((files) => console.log(`Files fetched for Employee ID ${employeeId}:`, files))
    );
  }
  updateProject(projectId: number, updatedProject: Project): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/Projects/${projectId}`, updatedProject).pipe(
      tap((response) => console.log(`Project with ID ${projectId} updated:`, response))
    );
  }

  deleteProject(projectId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Projects/${projectId}`).pipe(
      tap(() => console.log(`Project with ID ${projectId} deleted`))
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
  getEmployeeRoleByRoleId(roleId: number): Observable<EmployeeRoles> {
    return this.http.get<EmployeeRoles>(`${this.apiUrl}/EmployeeRoles/${roleId}`);
  }
  createProject(project: Project): Observable<Project> {
    return this.http.post<Project>(`${this.apiUrl}/Projects`, project).pipe(
      tap((response) => console.log('Project created:', response))
    );
  }

}
