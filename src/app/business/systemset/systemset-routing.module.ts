import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SystemsetComponent} from './systemset/systemset.component';
import {SetConfigComponent} from './set-config/set-config.component';
import {SetPermissionComponent} from './set-permission/set-permission.component';
import {SetRoleComponent} from './set-role/set-role.component';
import {SetPartComponent} from './set-part/set-part.component';

const routes: Routes = [
  {
    path: '',
    component: SystemsetComponent,
    children: [
      {path: 'config', component: SetConfigComponent},
      {path: 'permission', component: SetPermissionComponent},
      {path: 'role', component: SetRoleComponent},
      {path: 'part', component: SetPartComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemsetRoutingModule { }
