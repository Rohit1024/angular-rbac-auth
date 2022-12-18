import { Injectable } from '@angular/core';
import { ProfileUser, Roles } from '../models/user';
import {
  collection,
  doc,
  Firestore,
  updateDoc,
  getDocs,
  deleteDoc,
  addDoc,
  QueryDocumentSnapshot,
  DocumentData,
} from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { Employee } from '../models/employee';
import { UsersService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class CrudService {
  user!: ProfileUser | null;
  constructor(private firestore: Firestore, private userService: UsersService) {
    this.userService.currentUserProfile$.subscribe(user => this.user = user)
    localStorage.setItem('user', JSON.stringify(this.user));
  }

  mapToEmployee(emp: QueryDocumentSnapshot<DocumentData>){
    const employee: Employee = {
      id: emp.id,
      fullName: emp.data()['fullName'],
      email: emp.data()['email'],
      gender: emp.data()['gender'],
      phone: emp.data()['phone'],
      dateOfBirth: emp.data()['dateOfBirth'],
      department: emp.data()['department'],
      salary: emp.data()['salary']
    }
    return employee;
  }

  async getallEmployees(): Promise<Employee[]> {
      const employees: Employee[] = [];
      const querySnapshot = await getDocs(collection(this.firestore, 'employees-collection'));
      querySnapshot.forEach((doc) => {
        const employee = doc;
        employees.push(this.mapToEmployee(employee) as Employee);
      })
      return employees;
  }

  addEmployee(employee: Employee):Observable<any> {
    if (this.canEdit(this.user!)) {
      const ref = collection(this.firestore, 'employees-collection');
      return from(addDoc(ref, employee));
    } else
      return from(Promise.reject(
        new Error('You have not enough permissions to add employees')
      ));
  }

  updateEmployee(employee: Employee):Observable<any> {
    if (this.canEdit(this.user!)) {
      const ref = doc(this.firestore, `employees-collection/${employee.id}`);
      return from(updateDoc(ref, { ...employee }));
    } else
      return  from(Promise.reject(
        new Error('You have not enough permissions to edit employees')
      ));
  }

  deleteEmployee(id: string):Observable<any> {
    if (this.canDelete(this.user!)) {
      const ref = doc(this.firestore, `employees-collection/${id}`);
      return from(deleteDoc(ref));
    } else
      return from(Promise.reject(
        new Error('You have not enough permissions to delete employees')
      ));
  }

  canRead(user: ProfileUser): boolean {
    const allowed: Roles[] = ["user", "editor", "admin"];
    return this.checkAuthorization(user, allowed);
  }

  canEdit(user: ProfileUser): boolean {
    const allowed: Roles[] = ["editor", "admin"];
    return this.checkAuthorization(user, allowed);
  }

  canDelete(user: ProfileUser): boolean {
    const allowed: Roles[] = ["admin"];
    return this.checkAuthorization(user, allowed);
  }

  // determines if user has matching role
  private checkAuthorization(user: ProfileUser, allowedRoles: Roles[]): boolean {
    if (!user || !user.role) return false;
  // Check if the user's role is present in the allowed roles
  return user.role.some((role) => allowedRoles.includes(role));
  }
}
