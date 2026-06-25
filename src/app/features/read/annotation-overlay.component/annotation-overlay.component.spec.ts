import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotationOverlayComponent } from './annotation-overlay.component';

describe('AnnotationOverlayComponent', () => {
  let component: AnnotationOverlayComponent;
  let fixture: ComponentFixture<AnnotationOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnotationOverlayComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnnotationOverlayComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
