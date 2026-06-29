import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialtyListComponent } from './specialty-list.component';

describe('SpecialtyListComponent', () => {
  let component: SpecialtyListComponent;
  let fixture: ComponentFixture<SpecialtyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialtyListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SpecialtyListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
