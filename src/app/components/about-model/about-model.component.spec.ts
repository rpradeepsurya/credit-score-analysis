import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutModelComponent } from './about-model.component';

describe('AboutModelComponent', () => {
  let component: AboutModelComponent;
  let fixture: ComponentFixture<AboutModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AboutModelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
