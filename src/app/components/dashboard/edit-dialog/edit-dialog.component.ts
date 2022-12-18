import { formatDate } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { Employee } from 'src/app/models/employee';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditDialogComponent implements OnInit {
  errorMessage: any = "Edit dialog Closed";
  editForm = this.fb.group({
    id:[this.employee.id],
    fullName: ['', [Validators.required, Validators.minLength(5)]],
    email: ['', [Validators.required, Validators.email]],
    gender: ['', Validators.required],
    dateOfBirth: [formatDate(new Date(), "yyyy-MM-dd", "en"), Validators.required],
    phone: ['', Validators.required],
    department: ['', Validators.required],
    salary: [0, Validators.required]
  })
  actionBtn: string = 'Update';
  dialogTitle: string = 'Update Employee';
  departments = [
    'Engineering',
    'Salesforce',
    'Accounting',
    'Marketing',
    'Support',
    'Legal',
    'Services',
    'Human Resources',
    'Product Management',
    'Training',
    'Business Development',
    'Research & Development',
  ];

  constructor(private fb: NonNullableFormBuilder,
    private api: CrudService,
    private dialogRef: MatDialogRef<EditDialogComponent>,
    private toast: HotToastService,
    @Inject(MAT_DIALOG_DATA)
    private employee: Employee) { }

  ngOnInit(): void {
    if(this.employee){
      this.editForm.patchValue({
        fullName: this.employee.fullName,
        email: this.employee.email,
        gender: this.employee.gender,
        dateOfBirth: this.employee.dateOfBirth,
        phone: this.employee.phone,
        department: this.employee.department,
        salary: this.employee.salary
      });
    }
  }

  formatDate(e:any) {
    var convertDate = new Date(e.target.value).toISOString().substring(0, 10);
    this.editForm.get('dateOfBirth')?.setValue(convertDate, {
      onlyself: true,
    });
  }

  public handleError = (controlName: string, errorName: string) => {
    return (
      this.editForm.get(controlName)?.touched &&
      this.editForm.get(controlName)?.errors &&
      this.editForm.get(controlName)?.hasError(errorName)
    );
  };

  updateEmployee() {
    if(this.editForm.valid) {
      // const { id } = this.employee;
      const {id, fullName, email, gender, phone, dateOfBirth, department, salary} = this.editForm.value; 
      this.api.updateEmployee({id, fullName, email, gender, phone, dateOfBirth, department, salary}).pipe(
        this.toast.observe({
          success: 'Employee Updated successfully',
          loading: 'Loading...',
          error: ({ message }) => {
            console.log(message);
            return `There was an error: ${message}`;
          },
        })
      )
      .subscribe(() => {
        this.dialogRef.close();
      });
    }
  }

}
