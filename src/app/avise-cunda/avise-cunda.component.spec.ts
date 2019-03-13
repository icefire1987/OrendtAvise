import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AviseCundaComponent } from './avise-cunda.component';

describe('AviseCundaComponent', () => {
  let component: AviseCundaComponent;
  let fixture: ComponentFixture<AviseCundaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AviseCundaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AviseCundaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
