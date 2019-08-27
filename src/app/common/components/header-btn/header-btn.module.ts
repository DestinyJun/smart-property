import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicBtnComponent } from './basic-btn/basic-btn.component';



@NgModule({
  declarations: [BasicBtnComponent],
  imports: [
    CommonModule
  ],
  exports: [BasicBtnComponent]
})
export class HeaderBtnModule { }
