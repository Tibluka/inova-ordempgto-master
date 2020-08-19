import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrdensPagamentoComponent } from '../ordens-pagamento/ordens-pagamento.component';
import { OrdemInterface } from '../models/Ordem';
import { OrdemService } from '../services/ordem.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';


export const MY_FORMATS = {
  parse: {
    dateInput: 'L',
  },
  display: {
    dateInput: 'L',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'L',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-nova-ordem',
  templateUrl: './nova-ordem.component.html',
  styleUrls: ['./nova-ordem.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class NovaOrdemComponent implements OnInit {

  ordem: OrdemInterface = {};
  ordemForm: FormGroup = null;
  isSubmitted = false;
  loading: boolean = false;
  success_warn: boolean = false;
  cadastrou: boolean = false;

  isEditing: boolean = false

  money_mask = function (rawValue) {
    rawValue = rawValue.replace(/\./g, '').replace(/\,/g, '')
    let mask = [];
    let ct = 0;
    for (var x = rawValue.length; x > 0; x--) {
      if (x == rawValue.length) {
        mask.push(/[0-9]/)
      } else if (x == (rawValue.length - 1)) {
        mask.push(/[0-9]/)
      } else {
        if (x == (rawValue.length - 2)) {
          mask.push(',')
        }
        if (ct === 3) {
          mask.push('.')
          ct = 0;
        }
        ct++
        mask.push(/[0-9]/)

      }
    }
    return mask.reverse()
  }

  constructor(
    public dialogRef: MatDialogRef<OrdensPagamentoComponent>,
    private ordemService: OrdemService,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
    if (this.data) {
      this.isEditing = true;
      this.ordem = this.data;
      this.ordemForm = this.formBuilder.group({
        numero_nota_ato: [this.data.numero_nota_ato, Validators.required],
        data_lavratura_ato: [new Date(this.data.data_lavratura), Validators.required],
        livro_ato: [this.data.livro_ato, Validators.required],
        folha_ato: [this.data.folha_ato, Validators.required],
        valor_total: [this.data.valor_total, Validators.required],
      })
    } else {
      this.ordemForm = this.formBuilder.group({
        numero_nota_ato: ['', Validators.required],
        data_lavratura_ato: ['', Validators.required],
        livro_ato: ['', Validators.required],
        folha_ato: ['', Validators.required],
        valor_total: ['', Validators.required],
      })
    }
  }

  onNoClick(): void {
    this.dialogRef.close(this.cadastrou);
  }

  novaOrdem() {
    this.ordemForm.reset();
    this.success_warn = false;
  }

  cadastrarOrdem() {
    this.isSubmitted = true;

    if (!this.success_warn) {
      if (this.ordemForm.invalid) {
        this._snackBar.open('Por favor, preencha os campos', 'Ok', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
        return;
      }

      if (this.isEditing) {
        this.loading = true;
        this.ordemService.atualizarOrdem(this.ordem.codigo, this.ordemForm.value)
          .then((results: any) => {
            this.loading = false;
            this.cadastrou = true;
            this.router.navigate([`ordem-detalhe/${this.ordem.codigo}`])
            this.dialogRef.close(this.cadastrou);
          })
          .catch(err => {
            this.loading = false;
            this._snackBar.open('Ocorreu um erro, por favor tente mais tarde', 'Ok', {
              duration: 4000,
              panelClass: ['error-snackbar']
            });
          })
      } else {
        this.loading = true;
        this.ordemService.cadastrarOrdem(this.ordemForm.value)
          .then((results: any) => {
            this.loading = false;
            this.success_warn = true;
            this.cadastrou = true;
            let insertId = results.insertId;
            this.router.navigate([`ordem-detalhe/${insertId}`])
            this.dialogRef.close(this.cadastrou);
          })
          .catch(err => {
            this.loading = false;
            this._snackBar.open('Ocorreu um erro, por favor tente mais tarde', 'Ok', {
              duration: 4000,
              panelClass: ['error-snackbar']
            });
          })
      }
    }
  }
}
