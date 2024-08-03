import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaComponent } from './carga.component';

describe('CargaComponent', () => {
  let component: CargaComponent;
  let fixture: ComponentFixture<CargaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CargaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
