export interface Employee{
  Id: number;
  Name: string;
  Surname: string;
  Role_ID: number;
  PictureUrl: string;
}

export interface EmployeeIdent{
  Id: number;
  Username: string;
  Password: string;
  EmployeeId: number;
}

export interface EmployeeWithIdentDTO{
  name: string;
  surname: string;
  username: string;
  password: string;
}

export interface EmployeeP{
  ProjectId: number;
  EmployeeIdent: number;
}

export interface EmployeeRoles{
  Id: number;
  Rolename: string;
}

export interface Files{
  Id:number;
  FileName: string;
  FilePath:string;
  FileSize: number;
  FileType: string;
  Date:string;
  Description: string;
  IsActive:boolean;
  EmployeeIdentId: number;
}

export interface Project{
  Id: number;
  ProjectName: string;
  Description: string;
  StartDate: string;
  EndDate: string;
  IsActive: boolean;
}
