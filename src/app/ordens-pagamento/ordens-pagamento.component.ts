import { Component, OnInit, ViewChild } from '@angular/core';
import { OrdemInterface } from '../models/Ordem';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { toBRDate, getPeriodoDefault } from '../utils/DateUtils';
import { MatDialog } from '@angular/material/dialog';
import { NovaOrdemComponent } from '../nova-ordem/nova-ordem.component';
import { OrdemService } from '../services/ordem.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  AbstractControl,
} from '@angular/forms';

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

import { isValidCpf } from '../utils/Validators';
import textMask, { conformToMask } from 'angular2-text-mask'

const moment = _rollupMoment || _moment;

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
  selector: 'app-ordens-pagamento',
  templateUrl: './ordens-pagamento.component.html',
  styleUrls: ['./ordens-pagamento.component.scss'],
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
export class OrdensPagamentoComponent implements OnInit {
  ordens: OrdemInterface[];
  dataSource;
  loading: boolean = false;
  searchForm: FormGroup = null;

  cpf_mask = [/[0-9]/, /[0-9]/, /[0-9]/, '.', /[0-9]/, /[0-9]/, /[0-9]/, '.', /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/]

  periodoDefault: {} = getPeriodoDefault();
  pesquisa = {
    periodoDe: this.periodoDefault['periodoDe'],
    periodoAte: this.periodoDefault['periodoAte'],
    numero_nota_ato: '',
    pagador: '',
  };

  tipoPesquisa: string = 'periodo';

  money_mask = function (rawValue) {
    rawValue += '';
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
    public dialog: MatDialog,
    private ordemService: OrdemService,
    private formBuilder: FormBuilder
  ) { }



  displayedColumns: string[] = [
    'numero_nota_ato',
    'data_lavratura',
    'livro_ato',
    'folha_ato',
    'valor_total',
    'action',
  ];

  @ViewChild('paginator') paginator: MatPaginator;

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      periodoDe: [this.periodoDefault['periodoDe'], Validators.required],
      periodoAte: [this.periodoDefault['periodoAte'], Validators.required],
      //numero_nota_ato: ['', Validators.required],
      //pagador: ['', Validators.required]
    });

    this.loadOrdens();
  }

  loadOrdens() {
    this.loading = true;
    this.dataSource = null;
    this.ordens = [];

    this.ordemService
      .getOrdens(this.tipoPesquisa, this.searchForm.value)
      .then((ordens: OrdemInterface[]) => {
        this.ordens = ordens.map((ordem) => {
          ordem.data_lavratura = toBRDate(ordem.data_lavratura);
          ordem.valor_total = conformToMask(
            ordem.valor_total,
            this.money_mask,
            { guide: false }
          ).conformedValue
          return ordem;
        });
        this.dataSource = new MatTableDataSource<OrdemInterface>(this.ordens);
        this.dataSource.paginator = this.paginator;
        this.loading = false;
      })
      .catch((err) => {
        console.log(err);
        this.loading = false;
      });
  }

  clickPesquisar() {
    if (this.searchForm.valid) this.loadOrdens();
  }

  tipoPesquisaChange(event) {
    this.tipoPesquisa = event.target.value;

    try {
      this.pesquisa.periodoDe = this.searchForm.get('periodoDe').value;
    } catch (e) { }
    try {
      this.pesquisa.periodoAte = this.searchForm.get('periodoAte').value;
    } catch (e) { }
    try {
      this.pesquisa.numero_nota_ato = this.searchForm.get(
        'numero_nota_ato'
      ).value;
    } catch (e) { }
    try {
      this.pesquisa.pagador = this.searchForm.get('pagador').value;
    } catch (e) { }

    switch (this.tipoPesquisa) {
      case 'periodo':
        this.searchForm.removeControl('numero_nota_ato');
        this.searchForm.removeControl('pagador');
        this.searchForm.addControl(
          'periodoDe',
          new FormControl(this.pesquisa.periodoDe, Validators.required)
        );
        this.searchForm.addControl(
          'periodoAte',
          new FormControl(this.pesquisa.periodoAte, Validators.required)
        );
        break;

      case 'numero_nota_ato':
        this.searchForm.removeControl('periodoDe');
        this.searchForm.removeControl('periodoAte');
        this.searchForm.removeControl('pagador');
        this.searchForm.addControl(
          'numero_nota_ato',
          new FormControl(this.pesquisa.numero_nota_ato, Validators.required)
        );
        break;

      case 'pagador':
        this.searchForm.removeControl('periodoDe');
        this.searchForm.removeControl('periodoAte');
        this.searchForm.removeControl('numero_nota_ato');
        this.searchForm.addControl(
          'pagador',
          new FormControl(this.pesquisa.pagador, [Validators.required, isValidCpf])
        );

        break;
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(NovaOrdemComponent, {
      width: '600px',
      height: '500px',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      result ? this.loadOrdens() : '';
    });
  }
}
