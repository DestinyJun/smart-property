import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {ErrorComponent} from './error/error.component';
import {LoginGuard} from './common/guard/login.guard';
import {PersionalComponent} from './persional/persional.component';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule), canActivate: [LoginGuard]},
  {path: 'error', component: ErrorComponent},
  {path: 'persion', component: PersionalComponent},
  {path: '**', component: ErrorComponent},  // fallback router must in the last
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
