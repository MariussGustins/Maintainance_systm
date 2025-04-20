export interface Employee{
  Id: number;
  name: string;
  surname: string;
  role_Id: number;
  roleName: string;
  pictureUrl: string;
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
  roleName: string;
}

export interface Files{
  Id:number;
  fileName: string;
  filePath:string;
  fileSize: number;
  fileType: string;
  date:string;
  description: string;
  IsActive:boolean;
  EmployeeIdentId: number;
}

export interface Project{
  Id: number;
  projectName: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}
