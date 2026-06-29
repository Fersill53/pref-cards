import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PreferenceCardService, PreferenceCard, Annotation, Surgeon } from '../../../core/services/preference-card.service';
import { AnnotationOverlay } from '../annotation-overlay.component/annotation-overlay.component';

@Component({
  selector: 'app-card-view',
  standalone: true,
  imports: [AnnotationOverlay],
  templateUrl: './card-view.component.html'
})
export class CardView implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router)
  private cardService = inject(PreferenceCardService);

  card = signal<PreferenceCard | null>(null);
  surgeon = signal<Surgeon | null>(null);
  annotations = signal<Annotation[]>([]);
  loading = signal(true);
  activeSection = signal<string | null>(null);
  showDeleteConfirm = signal(false);
  deleting = signal(false);

  // Annotation Overlay
  overlayOpen = signal(false);
  overlayFieldPath = signal('');
  overlayFieldLabel = signal('');
  activeSelection = signal('');

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.router.navigate(['/']); return; }

    const [card, annotations] = await Promise.all([
      this.cardService.getCard(id),
      this.cardService.getAnnotations(id)
    ]);

    this.card.set(card);
    this.annotations.set(annotations);

    if (card?.surgeon_id) {
      const surgeon = await this.cardService.getSurgeon(card.surgeon_id);
      this.surgeon.set(surgeon);
    }

    this.loading.set(false);
  }

  toggleSection(section: string) {
    this.activeSection.update(current => current === section ? null : section)
  }

  isSectionOpen(section: string) {
    return this.activeSection() === section;
  }

  getAnnotationsForField(fieldPath: string) {
    return this.annotations().filter(a => a.field_path === fieldPath);
  }

  openAnnotation(fieldPath: string, fieldLabel: string) {
    this.overlayFieldPath.set(fieldPath);
    this.overlayFieldLabel.set(fieldLabel);
    this.overlayOpen.set(true);
  }

  closeOverlay() {
    this.overlayOpen.set(false);
  }

  async onAnnotationSaved() {
    this.overlayOpen.set(false);
    const id = this.card()?.id;
    console.log('Card ID:', id);
    if (id) {
      const result = await this.cardService.getAnnotations(id);
      console.log('Annotations fetched:', result);
      this.annotations.set(result);
    }
  }

  async deleteAnnotation(annotationId: string) {
    await this.cardService.deleteAnnotation(annotationId);
    const id = this.card()?.id;
    if (id) this.annotations.set(await this.cardService.getAnnotations(id));
  }

  async acceptAnnotation(annotation: Annotation) {
    const card = this.card();
    if (!card) return;
    await this.cardService.acceptAnnotation(annotation, card);
    const id = card.id!;
    const [updatedCard, updatedAnnotations] = await Promise.all([
      this.cardService.getCard(id),
      this.cardService.getAnnotations(id),
    ]);
    this.card.set(updatedCard);
    this.annotations.set(updatedAnnotations);
  }

  confirmDelete() {
    this.showDeleteConfirm.set(true);
  }

  cancelDelete() {
    this.showDeleteConfirm.set(false);
  }

  async deleteCard() {
    const id = this.card()?.id;
    if (!id) return;
    this.deleting.set(true);
    await this.cardService.deleteCard(id);
    this.deleting.set(false);
    this.router.navigate(['/']);
  }

  goToEdit() {
    this.router.navigate(['/edit', this.card()?.id]);
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
