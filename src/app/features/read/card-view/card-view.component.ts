import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PreferenceCardService, PreferenceCard, Annotation } from '../../../core/services/preference-card.service';

@Component({
  selector: 'app-card-view',
  standalone: true,
  imports: [],
  templateUrl: './card-view.component.html'
})
export class CardView implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router)
  private cardService = inject(PreferenceCardService);

  card = signal<PreferenceCard |  null>(null);
  annotations = signal<Annotation[]>([]);
  loading = signal(true);
  activeSection = signal<string | null>(null);

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.router.navigate(['/cards']); return; }

    const [card, annotations] = await Promise.all([
      this.cardService.getCard(id),
      this.cardService.getAnnotations(id)
    ]);

    this.card.set(card);
    this.annotations.set(annotations);
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

  goToEdit() {
    this.router.navigate(['/edit', this.card()?.id]);
  }

  goBack() {
    this.router.navigate(['/cards']);
  }
}
