import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddDialogComponent } from './add-dialog/add-dialog.component';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { DashboardComponent } from './dashboard.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { HotToastModule } from '@ngneat/hot-toast';



@NgModule({
  declarations: [
    DashboardComponent,
    AddDialogComponent,
    EditDialogComponent,
    DeleteDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    HotToastModule.forRoot()
  ],
  exports: []
})
export class DashboardModule { }
