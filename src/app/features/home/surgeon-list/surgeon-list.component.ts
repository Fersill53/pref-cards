import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PreferenceCardService, Surgeon } from '../../../core/services/preference-card.service';

@Component({
  selector: 'app-surgeon-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './surgeon-list.component.html',
})
export class SurgeonList implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  protected cardService = inject(PreferenceCardService);

  specialtyId = signal('');
  specialtyName = signal('');
  showAddSurgeon = signal(false);
  newSurgeonName = signal('');
  saving = signal(false);

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('specialtyId') ?? '';
    this.specialtyId.set(id);
    const nav = history.state;
    this.specialtyName.set(nav?.specialtyName ?? 'Specialty');
    await this.cardService.loadSurgeonsBySpecialty(id);
  }

  goToCards(surgeon: Surgeon) {
    this.router.navigate(['/surgeon', surgeon.id, 'cards'], {
      state: { surgeonName: surgeon.name, specialtyName: this.specialtyName() }
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }

  async addSurgeon() {
    if (!this.newSurgeonName().trim()) return;
    this.saving.set(true);
    await this.cardService.upsertSurgeon({
      name: this.newSurgeonName().trim(),
      specialty_id: this.specialtyId(),
    });
    await this.cardService.loadSurgeonsBySpecialty(this.specialtyId());
    this.newSurgeonName.set('');
    this.showAddSurgeon.set(false);
    this.saving.set(false);
  }
}