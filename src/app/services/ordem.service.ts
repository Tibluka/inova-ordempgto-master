import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from './token.service';
import { OrdemInterface } from '../models/Ordem';
import { getPeriodoDefaultISO } from '../utils/DateUtils';

const API_URL = 'https://f2rkl509o9.execute-api.us-west-2.amazonaws.com/dev';

@Injectable({
  providedIn: 'root',
})
export class OrdemService {
  constructor(private http: HttpClient, private tokenService: TokenService) { }

  getOrdens(tipoPesquisa, pesquisa) {
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

          let params = '';

          switch (tipoPesquisa) {
            case 'periodo':
              if (pesquisa.periodoDe && pesquisa.periodoAte) {
                params = `periodoDe=${pesquisa.periodoDe.toISOString()}&periodoAte=${pesquisa.periodoAte.toISOString()}`;
              } else {
                var periodo: any = getPeriodoDefaultISO();
                params = `periodoDe=${periodo.periodoDe}&periodoAte=${periodo.periodoAte}`;
              }
              break;
            case 'numero_nota_ato':
              params = `numero_nota_ato=${pesquisa.numero_nota_ato}`;
              break;
            case 'pagador':
              params = `pagador=${pesquisa.pagador}`;
              break;
          }

          this.http
            .get<OrdemInterface[]>(
              `${API_URL}/ordenspgto?${params}`,
              httpOptions
            )
            .subscribe(
              (ordens) => {
                resolve(ordens);
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

  getOrdem(codigo: number) {
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
            .get<OrdemInterface[]>(
              `${API_URL}/ordenspgto/${codigo}`,
              httpOptions
            )
            .subscribe(
              (ordens) => {
                resolve(ordens[0]);
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

  cadastrarOrdem(ordem) {
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
            .post<OrdemInterface[]>(`${API_URL}/ordenspgto`, ordem, httpOptions)
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

  atualizarOrdem(codigo_ordem, ordem) {
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
            .put<OrdemInterface[]>(`${API_URL}/ordenspgto/${codigo_ordem}`, ordem, httpOptions)
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
