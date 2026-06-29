import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurgeonListComponent } from './surgeon-list.component';

describe('SurgeonListComponent', () => {
  let component: SurgeonListComponent;
  let fixture: ComponentFixture<SurgeonListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurgeonListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SurgeonListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
