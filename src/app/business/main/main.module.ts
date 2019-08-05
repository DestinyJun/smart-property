import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import {MainRoutingModule} from './main-routing.module';
import { MainEventComponent } from './main-event/main-event.component';
import { MainStatisComponent } from './main-statis/main-statis.component';
import {EchartsBarModule} from '../../common/components/echarts-bar/echarts-bar.module';
import {EchartsPieModule} from '../../common/components/echarts-pie/echarts-pie.module';
import {ScrollPanelModule} from 'primeng/primeng';
import {BasicTableModule} from '../../common/components/basic-table/basic-table.module';


@NgModule({
  declarations: [
    MainComponent,
    MainEventComponent,
    MainStatisComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    EchartsBarModule,
    EchartsPieModule,
    ScrollPanelModule,
    BasicTableModule
  ]
})
export class MainModule { }
