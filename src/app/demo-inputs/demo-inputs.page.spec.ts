import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DemoInputsPage } from './demo-inputs.page';

describe('DemoInputsPage', () => {
  let component: DemoInputsPage;
  let fixture: ComponentFixture<DemoInputsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoInputsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
