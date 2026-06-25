import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PreferenceCardService, PreferenceCard, InstrumentItem, SutureItem } from '../../../core/services/preference-card.service';

@Component({
  selector: 'app-card-editor',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './card-editor.component.html',
})
export class CardEditor implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cardService = inject(PreferenceCardService);

  saving = signal(false);
  isEdit = signal(false);
  showDeleteConfirm = signal(false);
  deleting = signal(false);

  card = signal<PreferenceCard>({
    surgeon_name: '',
    procedure_name: '',
    specialty: '',
    positioning: '',
    prep_solution: '',
    draping: '',
    instruments: [],
    sutures: [],
    equipment: [],
    notes: '',
  });

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      const existing = await this.cardService.getCard(id);
      if (existing) this.card.set(existing);
    }
  }

  updateField(field: keyof PreferenceCard, value: any) {
    this.card.update(c => ({ ...c, [field]: value }));
  }

  // Instruments
  addInstrument() {
    this.card.update(c => ({
      ...c,
      instruments: [...c.instruments, { name: '', quantity: 1, notes: '' }]
    }));
  }

  updateInstrument(index: number, field: keyof InstrumentItem, value: any) {
    this.card.update(c => {
      const instruments = [...c.instruments];
      instruments[index] = { ...instruments[index], [field]: value };
      return { ...c, instruments };
    });
  }

  removeInstrument(index: number) {
    this.card.update(c => ({
      ...c,
      instruments: c.instruments.filter((_, i) => i !== index)
    }));
  }

  // Sutures
  addSuture() {
    this.card.update(c => ({
      ...c,
      sutures: [...c.sutures, { type: '', size: '', use: '' }]
    }));
  }

  updateSuture(index: number, field: keyof SutureItem, value: any) {
    this.card.update(c => {
      const sutures = [...c.sutures];
      sutures[index] = { ...sutures[index], [field]: value };
      return { ...c, sutures };
    });
  }

  removeSuture(index: number) {
    this.card.update(c => ({
      ...c,
      sutures: c.sutures.filter((_, i) => i !== index)
    }));
  }

  // Equipment
  addEquipment() {
    this.card.update(c => ({
      ...c,
      equipment: [...c.equipment, '']
    }));
  }

  updateEquipment(index: number, value: string) {
    this.card.update(c => {
      const equipment = [...c.equipment];
      equipment[index] = value;
      return { ...c, equipment };
    });
  }

  removeEquipment(index: number) {
    this.card.update(c => ({
      ...c,
      equipment: c.equipment.filter((_, i) => i !== index)
    }));
  }

  async save() {
    this.saving.set(true);
    const result = await this.cardService.upsertCard(this.card());
    this.saving.set(false);
    if (result) this.router.navigate(['/cards']);
  }

  confirmDelete() {
    this.showDeleteConfirm.set(true);
  }

  cancelDelete() {
    this.showDeleteConfirm.set(false);
  }

  async deleteCard() {
    const id = this.card().id;
    if (!id) return;
    this.deleting.set(true);
    await this.cardService.deleteCard(id);
    this.deleting.set(false);
    this.router.navigate(['/cards']);
  }

  cancel() {
    this.router.navigate(['/cards']);
  }
}