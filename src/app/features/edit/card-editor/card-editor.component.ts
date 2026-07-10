import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PreferenceCardService, PreferenceCard, InstrumentItem, SutureItem, Surgeon } from '../../../core/services/preference-card.service';

@Component({
  selector: 'app-card-editor',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './card-editor.component.html',
})
export class CardEditor implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  protected cardService = inject(PreferenceCardService);

  saving = signal(false);
  deleting = signal(false);
  isEdit = signal(false);
  showDeleteConfirm = signal(false);

  surgeonId = signal('');
  surgeonName = signal('');
  specialtyId = signal('');
  specialtyName = signal('');
  surgeons = signal<Surgeon[]>([]);

  card = signal<PreferenceCard>({
    surgeon_id: '',
    procedure_name: '',
    positioning: '',
    prep_solution: '',
    draping: '',
    instruments: [],
    sutures: [],
    supplies: [],
    equipment: [],
    notes: '',
  });

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const nav = history.state;

    if (id) {
      this.isEdit.set(true);
      const existing = await this.cardService.getCard(id);
      if (existing) {
        this.card.set(existing);
        this.surgeonId.set(existing.surgeon_id);
        // Load surgeon info
        const surgeon = await this.cardService.getSurgeon(existing.surgeon_id);
        if (surgeon) {
          this.surgeonName.set(surgeon.name);
          this.specialtyId.set(surgeon.specialty_id);
          await this.cardService.loadSurgeonsBySpecialty(surgeon.specialty_id);
          this.surgeons.set(this.cardService.surgeons());
        }
      }
    } else {
      if (nav?.surgeonId) {
        this.surgeonId.set(nav.surgeonId);
        this.surgeonName.set(nav.surgeonName ?? '');
        this.specialtyId.set(nav.specialtyId ?? '');
        this.specialtyName.set(nav.specialtyName ?? '');
        this.card.update(c => ({ ...c, surgeon_id: nav.surgeonId }));
        await this.cardService.loadSurgeonsBySpecialty(nav.specialtyId);
        this.surgeons.set(this.cardService.surgeons());
      }
    }
  }

  updateField(field: keyof PreferenceCard, value: any) {
    this.card.update(c => ({ ...c, [field]: value }));
  }

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

  addSupply() {
    this.card.update(c => ({ ...c, supplies: [...(c.supplies ?? []), ''] }));
  }

  updateSupply(index: number, value: string) {
    this.card.update(c => {
      const supplies = [...(c.supplies ?? [])];
      supplies[index] = value;
      return { ...c, supplies };
    });
  }

  removeSupply(index: number) {
    this.card.update(c => ({
      ...c,
      supplies: (c.supplies ?? []).filter((_, i) => i !== index)
    }));
  }

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
    if (result) {
      this.router.navigate(['/surgeon', this.surgeonId(), 'cards'], {
        state: { surgeonName: this.surgeonName(), specialtyName: this.specialtyName() }
      });
    }
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
    this.router.navigate(['/surgeon', this.surgeonId(), 'cards'], {
      state: { surgeonName: this.surgeonName(), specialtyName: this.specialtyName() }
    });
  }

  cancel() {
    this.router.navigate(['/surgeon', this.surgeonId(), 'cards'], {
      state: { surgeonName: this.surgeonName(), specialtyName: this.specialtyName() }
    });
  }
}
