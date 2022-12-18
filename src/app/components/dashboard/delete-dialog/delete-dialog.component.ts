import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteDialogComponent implements OnInit {
  errorMessage: any = "Delete dialog Closed";
  constructor(@Inject(MAT_DIALOG_DATA) public data: {id: string , name: string},
  private api: CrudService,
  private toast: HotToastService,
  private dialogRef: MatDialogRef<DeleteDialogComponent>) { }

  ngOnInit(): void {
  }

  delete(){
    this.api.deleteEmployee(this.data.id).pipe(
      this.toast.observe({
        success: 'Employee Deleted successfully',
        loading: 'Loading...',
        error: ({ message }) => `There was an error: ${message} `,
      })
    )
    .subscribe(() => {
      this.dialogRef.close();
    });
  }

}
