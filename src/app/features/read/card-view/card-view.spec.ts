import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardView } from './card-view';

describe('CardView', () => {
  let component: CardView;
  let fixture: ComponentFixture<CardView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardView],
    }).compileComponents();

    fixture = TestBed.createComponent(CardView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
