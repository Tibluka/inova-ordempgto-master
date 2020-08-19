import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from './token.service';
import { OrdemPagadorInterface } from '../models/OrdemPagador';
import { getPeriodoDefaultISO } from '../utils/DateUtils';
import { PagadorInterface } from '../models/Pagador';

const API_URL = 'https://f2rkl509o9.execute-api.us-west-2.amazonaws.com/dev';

@Injectable({
  providedIn: 'root',
})
export class PagadorService {
  constructor(private http: HttpClient, private tokenService: TokenService) { }

  getPagadoresPorOrdem(codigo_ordem) {
    return new Promise((resolve, reject) => {
      this.tokenService.getToken().subscribe(
        (tkn) => {
          let token = tkn['access_token'];

          let httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              Authorization: token,
            }),
          };

          this.http
            .get<any[]>(
              `${API_URL}/ordenspgto/${codigo_ordem}/pagadores`,
              httpOptions
            )
            .subscribe(
              (pagadores) => {
                let pagadoresitc: OrdemPagadorInterface[] = [];
                pagadores.forEach((p) => {
                  pagadoresitc.push({
                    pagador: {
                      cpf: p.cpf_pagador,
                      nome: p.nome,
                      telefone: p.telefone,
                      email: p.email,
                    },
                    valor: p.valor,
                    codigo_pedido: p.codigo_pedido,
                  });
                });
                resolve(pagadoresitc);
              },
              (err) => {
                reject(err);
              }
            );
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  getPagadorPorCPF(cpf) {
    return new Promise((resolve, reject) => {
      this.tokenService.getToken().subscribe(
        (tkn) => {
          let token = tkn['access_token'];

          let httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              Authorization: token,
            }),
          };

          this.http
            .get<any[]>(
              `${API_URL}/pagadores?cpf=${cpf}`,
              httpOptions
            )
            .subscribe(
              (pagadores) => {
                if (pagadores.length > 0) {
                  let pagador: PagadorInterface = {}
                  pagador = {
                    cpf: pagadores[0]['cpf'],
                    nome: pagadores[0]['nome'],
                    telefone: pagadores[0]['telefone'],
                    email: pagadores[0]['email'],
                  }
                  resolve(pagador);
                } else {
                  reject(false)
                }
              },
              (err) => {
                reject(err);
              }
            );
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  associatePagadorOrdem(codigo: number, ordemPagador: OrdemPagadorInterface) {
    return new Promise((resolve, reject) => {
      this.tokenService.getToken().subscribe(
        (tkn) => {
          let token = tkn['access_token'];

          let httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              Authorization: token,
            }),
          };

          this.http
            .put<any[]>(
              `${API_URL}/ordenspgto/${codigo}/pagadores`,
              ordemPagador,
              httpOptions
            )
            .subscribe(
              (result) => {
                resolve(result);
              },
              (err) => {
                reject(err);
              }
            );
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  dessasociarPagador(codigo_ordem: number, cpf_pagador: string) {
    return new Promise((resolve, reject) => {
      this.tokenService.getToken().subscribe(
        (tkn) => {
          let token = tkn['access_token'];

          let httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              Authorization: token,
            }),
          };

          this.http
            .delete<any[]>(
              `${API_URL}/ordenspgto/${codigo_ordem}/${cpf_pagador}`,
              httpOptions
            )
            .subscribe(
              (result) => {
                resolve(result);
              },
              (err) => {
                reject(err);
              }
            );
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
}
