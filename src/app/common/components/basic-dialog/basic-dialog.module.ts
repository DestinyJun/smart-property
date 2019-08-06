import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CalendarModule, CheckboxModule, DialogModule, DropdownModule, InputTextModule, KeyFilterModule} from 'primeng/primeng';
import {BasicDialogComponent} from './basic-dialog/basic-dialog.component';




@NgModule({
  declarations: [BasicDialogComponent],
  imports: [
    CommonModule,
    DialogModule,
    CheckboxModule,
    DropdownModule,
    CalendarModule,
    KeyFilterModule
  ],
  exports: [BasicDialogComponent]
})
export class BasicDialogModule { }
