import { Component, OnInit, ElementRef, ViewChild, } from '@angular/core';
import { OrdemService } from '../services/ordem.service';
import { OrdemInterface } from '../models/Ordem';
import { OrdemPagadorInterface } from '../models/OrdemPagador';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { toBRDate } from '../utils/DateUtils';
import { PagadorService } from '../services/pagador.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { isValidCpf } from '../utils/Validators';
import textMask, { conformToMask } from 'angular2-text-mask'
import { NovaOrdemComponent } from '../nova-ordem/nova-ordem.component';

@Component({
  selector: 'app-ordem-detalhe',
  templateUrl: './ordem-detalhe.component.html',
  styleUrls: ['./ordem-detalhe.component.scss'],
})
export class OrdemDetalheComponent implements OnInit {
  panelOpenState: boolean = false;
  novoPagador: boolean = false;
  loading: boolean = false;

  codigo: number = 0;
  ordem: OrdemInterface = {};
  pagadores: OrdemPagadorInterface[] = [];

  pagadorForm: FormGroup = null;

  cpf_mask = [/[0-9]/, /[0-9]/, /[0-9]/, '.', /[0-9]/, /[0-9]/, /[0-9]/, '.', /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/]

  phone_mask = function (rawValue) {
    rawValue += '';
    rawValue = rawValue.replace(/\(/g, '').replace(/\)/g, '').replace(/\ /g, '').replace(/\-/g, '').replace(/\_/g, '')
    if (rawValue.length <= 10) {
      return ['(', /[0-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
    } else {
      return ['(', /[0-9]/, /\d/, ')', ' ', /\d|''/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
    }
  }

  money_mask = function (rawValue) {
    rawValue += '';
    rawValue = rawValue.replace(/\./g, '').replace(/\,/g, '')
    let isNegative = rawValue.indexOf("-") !== -1 ? true : false
    rawValue = rawValue.replace(/\-/g, '');
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

  finishedLoading: number = 0;

  disableFields: boolean = true
  cpfsearched: string = '';
  total_declarado = '';
  total_offset = '';
  isEditingPagador: boolean = false;
  editingOrdem: OrdemPagadorInterface = {}

  constructor(
    private route: ActivatedRoute,
    private ordemService: OrdemService,
    private pagadorService: PagadorService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.codigo = this.route.snapshot.params.codigo;
    this.loadOrdem();
    this.loadPagadores();

    this.pagadorForm = this.formBuilder.group({
      cpf: ['', [Validators.required, isValidCpf]],
      nome: [{ value: '', disabled: this.disableFields }, Validators.required],
      email: [{ value: '', disabled: this.disableFields }, Validators.email],
      telefone: [{ value: '', disabled: this.disableFields }, Validators.required],
      valor: ['', Validators.required],
    });
  }

  loadOrdem() {
    this.loading = true;
    this.ordemService
      .getOrdem(this.codigo)
      .then((ordem: OrdemInterface) => {
        ordem.data_lavratura_display = toBRDate(ordem.data_lavratura);
        this.ordem = ordem;
        this.ordem.valor_total = conformToMask(
          ordem.valor_total,
          this.money_mask,
          { guide: false }
        ).conformedValue
        this.finishedLoading++
        if (this.finishedLoading >= 2) {
          this.loadTotais()
        }
        this.loading = false;
      })
      .catch((err) => {
        console.log(err);
        this.loading = false;
      });
  }

  loadPagadores() {
    this.loading = true;
    this.pagadorService
      .getPagadoresPorOrdem(this.codigo)
      .then((pagadores: OrdemPagadorInterface[]) => {
        this.pagadores = pagadores.map(p => {

          p.valor = conformToMask(
            p.valor,
            this.money_mask,
            { guide: false }
          ).conformedValue

          if (p.pagador.telefone.indexOf('(') === -1) {
            p.pagador.telefone = conformToMask(
              p.pagador.telefone,
              this.phone_mask,
              { guide: false }
            ).conformedValue
            return p;
          } else {
            return p;
          }
        });
        this.finishedLoading++
        if (this.finishedLoading >= 2) {
          this.loadTotais()
        }
        this.loading = false;
      })
      .catch((err) => {
        console.log(err);
        this.loading = false;
      });
  }

  loadTotais() {
    let valor_declarado = 0
    this.pagadores.forEach(p => {
      valor_declarado += this.parseMoney(p.valor)
    })
    let count = (valor_declarado - this.parseMoney(this.ordem.valor_total))

    let offsetNegative = count < 0 ? '-' : '+';
    let offset = count + ''
    if (offset.indexOf('.') === -1) {
      offset += '00'
    } else {
      offset = offset.split('.')[0] + offset.split('.')[1].padEnd(2, '0')
    }

    let declared = valor_declarado + ''
    if (declared.indexOf('.') === -1) {
      declared += '00'
    } else {
      declared = declared.split('.')[0] + declared.split('.')[1].padEnd(2, '0')
    }

    this.total_declarado = 'R$ ' + conformToMask(
      declared,
      this.money_mask,
      { guide: false }
    ).conformedValue
    this.total_offset = offsetNegative + 'R$ ' + conformToMask(
      offset,
      this.money_mask,
      { guide: false }
    ).conformedValue
  }

  novoPagadorBtn() {
    this.calculateValue()
    this.novoPagador = true;
  }

  associate() {
    if (this.pagadorForm.invalid) {
      this._snackBar.open('Por favor, preencha os campos', 'Ok', {
        duration: 4000,
        panelClass: ['error-snackbar'],
      });
      return;
    }
    if (this.isEditingPagador) {
      this.loading = true;

      this.pagadorService.dessasociarPagador(this.ordem.codigo, this.editingOrdem.pagador.cpf)
        .then((result) => {
          let ordemPagadorInterface: OrdemPagadorInterface = {};
          ordemPagadorInterface.ordem = this.ordem;
          ordemPagadorInterface.pagador = this.pagadorForm.value;
          ordemPagadorInterface.valor = this.pagadorForm.get('valor').value;
          ordemPagadorInterface.codigo_pedido = '0';

          this.pagadorService
            .associatePagadorOrdem(this.ordem.codigo, ordemPagadorInterface)
            .then((result) => {
              this.pagadores.push(ordemPagadorInterface);
              this.loadTotais()
              this.novoPagador = false;
              this.pagadorForm.reset();
              this.loading = false;
            })
            .catch((err) => {
              console.log(err)
              this.loading = false;
              this._snackBar.open(
                'Ocorreu um erro, por favor tente novamente mais tarde',
                'Ok',
                {
                  duration: 4000,
                  panelClass: ['error-snackbar'],
                }
              );
            });
        })
        .catch((err) => {
          console.log(err)
          this.loading = false;
          this._snackBar.open(
            'Ocorreu um erro, por favor tente novamente mais tarde',
            'Ok',
            {
              duration: 4000,
              panelClass: ['error-snackbar'],
            }
          );
        });
    } else {
      this.loading = true;
      let ordemPagadorInterface: OrdemPagadorInterface = {};
      ordemPagadorInterface.ordem = this.ordem;
      ordemPagadorInterface.pagador = this.pagadorForm.value;
      ordemPagadorInterface.valor = this.pagadorForm.get('valor').value;
      ordemPagadorInterface.codigo_pedido = '0';

      this.pagadorService
        .associatePagadorOrdem(this.ordem.codigo, ordemPagadorInterface)
        .then((result) => {
          this.pagadores.push(ordemPagadorInterface);
          this.loadTotais()
          this.novoPagador = false;
          this.pagadorForm.reset();
          this.loading = false;
        })
        .catch((err) => {
          console.log(err)
          this.loading = false;
          this._snackBar.open(
            'Ocorreu um erro, por favor tente novamente mais tarde',
            'Ok',
            {
              duration: 4000,
              panelClass: ['error-snackbar'],
            }
          );
        });
    }
  }

  alterarPagador(ordemPagador: OrdemPagadorInterface) {
    this.pagadorForm.get('cpf').setValue(ordemPagador.pagador.cpf)
    this.pagadorForm.get('nome').setValue(ordemPagador.pagador.nome)
    this.pagadorForm.get('email').setValue(ordemPagador.pagador.email)
    this.pagadorForm.get('telefone').setValue(ordemPagador.pagador.telefone)
    this.pagadorForm.get('nome').enable()
    this.pagadorForm.get('email').enable()
    this.pagadorForm.get('telefone').enable()
    this.pagadorForm.get('valor').setValue(ordemPagador.valor)
    this.isEditingPagador = true;
    this.editingOrdem = ordemPagador;
    this.pagadores = this.pagadores.filter(p => {
      return p.pagador.cpf != ordemPagador.pagador.cpf
    })
    this.novoPagador = true;
    window.setTimeout(() => { this.scrollToBottom() }, 100);
  }

  cancelAlterar() {
    this.pagadores.push(this.editingOrdem)
    this.novoPagador = false
    this.isEditingPagador = false
  }

  scrollToBottom(): void {
    try {
      window.scrollTo(0, document.body.scrollHeight);
    } catch (err) { }
  }

  dettachPagador(cpf_pagador) {
    this.loading = true;
    this.pagadorService
      .dessasociarPagador(this.ordem.codigo, cpf_pagador)
      .then((result) => {
        this.loadPagadores();
      })
      .catch((err) => {
        this.loading = false;
        this._snackBar.open(
          'Ocorreu um erro, por favor tente novamente mais tarde',
          'Ok',
          {
            duration: 4000,
            panelClass: ['error-snackbar'],
          }
        );
      });
  }

  openDialog(pagador): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      height: '300px',
      data: { nome: pagador.nome, cpf: pagador.cpf }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dettachPagador(result)
      }
    });
  }

  parseMoney(txt) {
    txt = txt.replace(/\./g, '').replace(/\,/, '.')
    return parseFloat(txt)
  }

  calculateValue() {
    let original = this.parseMoney(this.ordem.valor_total)
    let valor_declarado = 0
    this.pagadores.forEach(p => {
      valor_declarado += this.parseMoney(p.valor)
    })
    let count = (original - valor_declarado).toString();
    if (count.indexOf('.') === -1) {
      count += '00'
    } else {
      count = count.split('.')[0] + count.split('.')[1].padEnd(2, '0')
    }
    count = count.replace(/\./g, '').replace(/\,/g, '')
    let setVal = conformToMask(
      count,
      this.money_mask,
      { guide: false }
    ).conformedValue
    this.pagadorForm.get('valor').setValue(setVal)
  }

  openEdit(): void {
    const dialogRef = this.dialog.open(NovaOrdemComponent, {
      width: '600px',
      height: '500px',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: this.ordem,
    });

    dialogRef.afterClosed().subscribe((result) => {
      result ? this.loadOrdem() : '';
    });
  }

  cpfChange(value) {
    let rawValue = value;
    if (this.cpfsearched !== rawValue) {
      this.cpfsearched = rawValue;
      value = value.replace(/\./g, '').replace(/\-/g, '').replace(/\_/g, '')
      if (value.length == 11 && this.pagadorForm.get('cpf').valid) {
        this.loading = true
        this.pagadorService.getPagadorPorCPF(rawValue)
          .then((pagador: any) => {
            this.pagadorForm.get('nome').setValue(pagador.nome)
            this.pagadorForm.get('nome').enable()
            this.pagadorForm.get('telefone').setValue(pagador.telefone)
            this.pagadorForm.get('telefone').enable()
            this.pagadorForm.get('email').setValue(pagador.email)
            this.pagadorForm.get('email').enable()
            this.disableFields = false;
            this.loading = false;
          })
          .catch(err => {
            this.pagadorForm.get('nome').setValue('')
            this.pagadorForm.get('telefone').setValue('')
            this.pagadorForm.get('email').setValue('')
            this.pagadorForm.get('nome').enable()
            this.pagadorForm.get('telefone').enable()
            this.pagadorForm.get('email').enable()
            this.disableFields = false;
            this.loading = false;
          })
      } else {
        this.pagadorForm.get('nome').setValue('')
        this.pagadorForm.get('telefone').setValue('')
        this.pagadorForm.get('email').setValue('')
        this.pagadorForm.get('nome').disable()
        this.pagadorForm.get('telefone').disable()
        this.pagadorForm.get('email').disable()
      }
    }
  }
}