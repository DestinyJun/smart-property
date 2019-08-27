import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CalendarModule, CheckboxModule,
  DialogModule, DropdownModule, FileUploadModule, InputTextareaModule, InputTextModule, RadioButtonModule, ScrollPanelModule, TreeModule,
} from 'primeng/primeng';
import {BasicDialogComponent} from './basic-dialog/basic-dialog.component';
import {ReactiveFormsModule} from '@angular/forms';
import {DetailPopComponent} from './detail-pop/detail-pop.component';
import {FilePopComponent} from './file-pop/file-pop.component';
import {BasicTableModule} from '../basic-table/basic-table.module';
import {UploadFileRecordComponent} from './upload-file-record/upload-file-record.component';



@NgModule({
  declarations: [
    BasicDialogComponent,
    DetailPopComponent,
    FilePopComponent,
   UploadFileRecordComponent],
  imports: [
    CommonModule,
    DialogModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    CheckboxModule,
    RadioButtonModule,
    InputTextareaModule,
    TreeModule,
    ScrollPanelModule,
    BasicTableModule,
    FileUploadModule,
  ],
  exports: [BasicDialogComponent, DetailPopComponent, FilePopComponent, UploadFileRecordComponent]
})
export class BasicDialogModule { }
