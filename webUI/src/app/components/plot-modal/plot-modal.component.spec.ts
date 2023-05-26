import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotModalComponent } from './plot-modal.component';

describe('PlotModalComponent', () => {
  let component: PlotModalComponent;
  let fixture: ComponentFixture<PlotModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlotModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlotModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
