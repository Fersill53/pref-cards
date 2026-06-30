import { Component, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PreferenceCardService } from '../../../core/services/preference-card.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-annotation-overlay',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './annotation-overlay.component.html',
})
export class AnnotationOverlay {
  private cardService = inject(PreferenceCardService);
  private authService = inject(AuthService);

  cardId = input.required<string>();
  fieldPath = input.required<string>();
  fieldLabel = input.required<string>();
  closed = output<void>();
  saved = output<void>();

  correction = signal('');
  saving = signal(false);

  get authorName() {
    return this.authService.displayName() || this.authService.user()?.email || 'Unknown';
  }

  async save() {
    if (!this.correction().trim()) return;
    this.saving.set(true);
    await this.cardService.addAnnotation({
      card_id: this.cardId(),
      field_path: this.fieldPath(),
      correction: this.correction(),
      author_name: this.authorName,
      is_verified: false,
    });
    this.saving.set(false);
    this.saved.emit();
  }

  close() {
    this.closed.emit();
    
  }
}