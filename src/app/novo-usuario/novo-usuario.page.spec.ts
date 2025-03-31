import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NovoUsuarioPage } from './novo-usuario.page';

describe('NovoUsuarioPage', () => {
  let component: NovoUsuarioPage;
  let fixture: ComponentFixture<NovoUsuarioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NovoUsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
