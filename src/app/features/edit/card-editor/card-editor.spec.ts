import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardEditor } from './card-editor';

describe('CardEditor', () => {
  let component: CardEditor;
  let fixture: ComponentFixture<CardEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardEditor],
    }).compileComponents();

    fixture = TestBed.createComponent(CardEditor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
