import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdensPagamentoComponent } from './ordens-pagamento/ordens-pagamento.component'
import { NovaOrdemComponent } from './nova-ordem/nova-ordem.component'
import { OrdemDetalheComponent } from './ordem-detalhe/ordem-detalhe.component'
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './guards/auth-guard.service'


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'ordens-pagamento', component: OrdensPagamentoComponent, canActivate: [AuthGuardService] },
  { path: 'login', component: LoginComponent },
  { path: 'ordem-detalhe/:codigo', component: OrdemDetalheComponent, canActivate: [AuthGuardService] },
  { path: '**', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
