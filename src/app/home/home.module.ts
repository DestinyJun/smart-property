import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { FooterComponent } from './footer/footer.component';
import {HomeRoutingModule} from './home-routing.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import {PanelMenuModule} from 'primeng/panelmenu';
import {ConfirmationService, ConfirmDialogModule} from 'primeng/primeng';
import {LoadingModule} from '../common/components/loading/loading.module';

@NgModule({
  declarations: [
    HeaderComponent,
    HomeComponent,
    BreadcrumbComponent,
    FooterComponent,
    SidebarComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    PanelMenuModule,
    ConfirmDialogModule,
    LoadingModule
  ],
  providers: [ConfirmationService]
})
export class HomeModule { }
