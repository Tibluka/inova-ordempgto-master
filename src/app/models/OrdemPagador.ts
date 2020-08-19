import { OrdemInterface } from './Ordem';
import { PagadorInterface } from './Pagador';

export interface OrdemPagadorInterface {
  ordem?: OrdemInterface;
  pagador?: PagadorInterface;
  codigo_pedido?: string;
  valor?: string;
}
