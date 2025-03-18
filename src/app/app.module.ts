import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { DataService } from './services/data.service';

// Firebase imports
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from '../environments/environment';

// FormsModule & ReactiveFormsModule imports
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MfaComponent } from './mfa/mfa.component';  // Import MfaComponent here

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HomeComponent // Declare MfaComponent here
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,  // Ensure FormsModule is imported here
    ReactiveFormsModule,
    MfaComponent 
  ],
  providers: [
    DataService,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth())
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
