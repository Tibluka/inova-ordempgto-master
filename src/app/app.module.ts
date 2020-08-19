import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OrdensPagamentoComponent } from './ordens-pagamento/ordens-pagamento.component';
import { NovaOrdemComponent } from './nova-ordem/nova-ordem.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { OrdemDetalheComponent } from './ordem-detalhe/ordem-detalhe.component';
import { LoginComponent } from './login/login.component';

import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthGuardService } from './guards/auth-guard.service';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { TextMaskModule } from 'angular2-text-mask';

//Services
import { TokenService } from './services/token.service';
import { LoginService } from './services/login.service';
import { OrdemService } from './services/ordem.service';
import { PagadorService } from './services/pagador.service';
import { LoadingComponent } from './loading/loading.component';
import { NavbarLoginComponent } from './navbar-login/navbar-login.component';
import { ConfirmDialogComponent } from './ordem-detalhe/confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    OrdensPagamentoComponent,
    NovaOrdemComponent,
    NavbarComponent,
    SidebarComponent,
    OrdemDetalheComponent,
    LoginComponent,
    LoadingComponent,
    NavbarLoginComponent,
    ConfirmDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatSelectModule,
    MatExpansionModule,
    MatDividerModule,
    MatSnackBarModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatMomentDateModule,
    TextMaskModule
  ],
  providers: [
    AuthGuardService,
    LoginService,
    OrdemService,
    TokenService,
    PagadorService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
