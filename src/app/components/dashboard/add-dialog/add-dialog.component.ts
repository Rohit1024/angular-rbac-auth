import { Component, Inject, OnInit } from '@angular/core';
import { Validators, NonNullableFormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { Employee } from 'src/app/models/employee';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.scss']
})
export class AddDialogComponent implements OnInit {
  
  addForm!: FormGroup;

  actionBtn: string = 'Save';
  dialogTitle: string = 'Add Employee';
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
  errorMessage: any = "Add dialog Closed";

  constructor(private fb: NonNullableFormBuilder,
    private api: CrudService,
    private dialogRef: MatDialogRef<AddDialogComponent>,
    private toast: HotToastService,
    @Inject(MAT_DIALOG_DATA)
    public employee: Employee) { }

  ngOnInit(): void {
    this.addForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      dateOfBirth: [Date.now(), Validators.required],
      phone: ['', Validators.required],
      department: ['', Validators.required],
      salary: ['', Validators.required]
    })
  }

  formatDate(e:any) {
    var convertDate = new Date(e.target.value).toISOString().substring(0, 10);
    this.addForm.get('dateOfBirth')?.setValue(convertDate, {
      onlyself: true,
    });
  }

  public handleError = (controlName: string, errorName: string) => {
    return (
      this.addForm.get(controlName)?.touched &&
      this.addForm.get(controlName)?.errors &&
      this.addForm.get(controlName)?.hasError(errorName)
    );
  };

  addEmployee() {
    if(this.addForm.valid) {
      const employee:Employee = this.addForm.value; 
      this.api.addEmployee(employee).pipe(
        this.toast.observe({
          success: 'Employee added successfully',
          loading: 'Loading...',
          error: ({ message }) => `There was an error: ${message} `,
        })
      )
      .subscribe(() => {
        this.dialogRef.close();
      });
    }
  }

}
