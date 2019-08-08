import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CalendarModule, CheckboxModule,
  DialogModule, DropdownModule, InputTextareaModule, InputTextModule, RadioButtonModule,
} from 'primeng/primeng';
import {BasicDialogComponent} from './basic-dialog/basic-dialog.component';
import {ReactiveFormsModule} from '@angular/forms';
import { FormControlComponent } from './form-control/form-control.component';



@NgModule({
  declarations: [
    BasicDialogComponent,
    FormControlComponent],
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
  ],
  exports: [BasicDialogComponent]
})
export class BasicDialogModule { }
