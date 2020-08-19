import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdensPagamentoComponent } from './ordens-pagamento.component';

describe('OrdensPagamentoComponent', () => {
  let component: OrdensPagamentoComponent;
  let fixture: ComponentFixture<OrdensPagamentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdensPagamentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdensPagamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
