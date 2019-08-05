import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CalendarModule, CheckboxModule, DialogModule, DropdownModule, InputTextModule} from 'primeng/primeng';
import {BasicDialogComponent} from './basic-dialog.component';



@NgModule({
  declarations: [BasicDialogComponent],
  imports: [
    CommonModule,
    DialogModule,
    CheckboxModule,
    DropdownModule,
    CalendarModule
  ],
  exports: [BasicDialogComponent]
})
export class BasicDialogModule { }
