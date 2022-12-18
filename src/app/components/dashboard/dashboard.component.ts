import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Employee } from 'src/app/models/employee';
import { ProfileUser } from 'src/app/models/user';
import { CrudService } from 'src/app/services/crud.service';
import { UsersService } from 'src/app/services/user.service';
import { AddDialogComponent } from './add-dialog/add-dialog.component';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements AfterViewInit {
  dataSource!: MatTableDataSource<Employee>;

  @ViewChild(MatPaginator, { static: false })
  paginator!: MatPaginator;

  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  columns: string[] = [
    'fullName',
    'email',
    'gender',
    'phone',
    'dateOfBirth',
    'department',
    'salary',
    'actions',
  ];
  employees!: Employee[];
  user$ = this.userService.currentUserProfile$;
  
  filterData(event: any) {
    const filterValue = event.target.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(
    private mat_dialog: MatDialog,
    public api: CrudService,
    private userService: UsersService
  ) { 
    this.api.getallEmployees().then(data => {
      console.log(data);
      this.employees = data;
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngAfterViewInit(): void {
    
  }

  getEmployees() {
    this.api.getallEmployees().then(data => {
      console.log(data);
      this.employees = data;
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  view(i: any, element: any) {
    alert(i);
  }

  add() {
    this.mat_dialog
      .open(AddDialogComponent, {
        width: '40%',
        disableClose: true,
      })
      .afterClosed()
      .subscribe((value) => {
        console.log(value);
        this.getEmployees();
      });
  }

  edit(index: number, employee: any) {
    this.mat_dialog
      .open(EditDialogComponent, {
        width: '40%',
        data: employee,
        disableClose: true,
      })
      .afterClosed()
      .subscribe((value) => {
        console.log(value);
        this.getEmployees();
      });
  }

  delete(index: number, employee: any) {
    this.mat_dialog
      .open(DeleteDialogComponent, {
        width: '40%',
        data: {
          id: employee.id,
          name: employee.fullName,
        },
        disableClose: true,
      })
      .afterClosed()
      .subscribe((value) => {
        console.log(value);
        this.getEmployees();
      });
  }
}
