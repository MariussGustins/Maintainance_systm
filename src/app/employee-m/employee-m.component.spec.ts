import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeMComponent } from './employee-m.component';

describe('EmployeeMComponent', () => {
  let component: EmployeeMComponent;
  let fixture: ComponentFixture<EmployeeMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeMComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
