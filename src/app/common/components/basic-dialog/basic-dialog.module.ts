import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CalendarModule,
  CheckboxModule,
  DialogModule,
  DropdownModule, InputTextareaModule,
  InputTextModule,
  KeyFilterModule,
  RadioButtonModule
} from 'primeng/primeng';
import {BasicDialogComponent} from './basic-dialog/basic-dialog.component';
import {FormsModule} from '@angular/forms';




@NgModule({
  declarations: [BasicDialogComponent],
  imports: [
    CommonModule,
    DialogModule,
    CheckboxModule,
    DropdownModule,
    CalendarModule,
    KeyFilterModule,
    FormsModule,
    RadioButtonModule,
    InputTextareaModule,
  ],
  exports: [BasicDialogComponent]
})
export class BasicDialogModule { }
