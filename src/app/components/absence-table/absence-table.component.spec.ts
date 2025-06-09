import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbsenceTableComponent } from './absence-table.component';

describe('AbsenceTableComponent', () => {
  let component: AbsenceTableComponent;
  let fixture: ComponentFixture<AbsenceTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbsenceTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbsenceTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
