// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntroComponent } from './intro/intro.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', redirectTo: 'intro', pathMatch: 'full' },
  { path: 'intro', component: IntroComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },  // Protected route
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] }  // Protected route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
