import { AuthHookComponent } from '@app/components/auth-hook/auth-hook.component';
import { OvertimeCalcComponent } from '@app/components/overtime-calc/overtime-calc.component';
import { LoginComponent } from '@app/components/login/login.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from '@app/components/root/app.component';
import { AuthInterceptor } from '@app/utils/auth.interceptor';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'authHook', component: AuthHookComponent},
  {path: 'overtime', component: OvertimeCalcComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AuthHookComponent,
    OvertimeCalcComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(
      routes
    )
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
