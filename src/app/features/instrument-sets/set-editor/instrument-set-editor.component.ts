import { Component, inject, OnInit, signal, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InstrumentSetService, InstrumentSet } from '../../../core/services/instrument-set.service';
import { OcrService } from '../../../core/services/ocr.service';

@Component({
  selector: 'app-instrument-set-editor',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './instrument-set-editor.component.html',
})
export class InstrumentSetEditor implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private setService = inject(InstrumentSetService);
  private ocrService = inject(OcrService);

  isEdit = signal(false);
  saving = signal(false);
  scanning = signal(false);
  scanError = signal('');
  specialtyId = signal('');
  specialtyName = signal('');

  set = signal<InstrumentSet>({
    name: '',
    specialty_id: '',
    instruments: [],
    notes: '',
  });

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const nav = history.state;
    this.specialtyId.set(nav?.specialtyId ?? '');
    this.specialtyName.set(nav?.specialtyName ?? '');

    if (id) {
      this.isEdit.set(true);
      const data = await this.setService.getSet(id);
      if (data) this.set.set(data);
      if (!this.specialtyId()) this.specialtyId.set(this.set().specialty_id);
    } else {
      this.set.update(s => ({ ...s, specialty_id: this.specialtyId() }));
    }
  }

  triggerScan() {
    this.fileInput.nativeElement.click();
  }

  async onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.scanning.set(true);
    this.scanError.set('');

    try {
      const parsed = await this.ocrService.scanImage(file);
      if (parsed.length === 0) {
        this.scanError.set('No instruments detected. Try a clearer photo.');
      } else {
        // Merge with existing instruments
        this.set.update(s => ({
          ...s,
          instruments: [
            ...s.instruments,
            ...parsed.map(p => ({ name: p.name, quantity: p.quantity, notes: '' }))
          ]
        }));
      }
    } catch {
      this.scanError.set('Could not read the image. Please try again.');
    }

    this.scanning.set(false);
    // Reset input so the same file can be selected again
    (event.target as HTMLInputElement).value = '';
  }

  updateName(value: string) {
    this.set.update(s => ({ ...s, name: value }));
  }

  updateNotes(value: string) {
    this.set.update(s => ({ ...s, notes: value }));
  }

  addInstrument() {
    this.set.update(s => ({
      ...s,
      instruments: [...s.instruments, { name: '', quantity: 1, notes: '' }]
    }));
  }

  updateInstrument(index: number, field: 'name' | 'quantity' | 'notes', value: string | number) {
    this.set.update(s => {
      const instruments = [...s.instruments];
      instruments[index] = { ...instruments[index], [field]: value };
      return { ...s, instruments };
    });
  }

  removeInstrument(index: number) {
    this.set.update(s => ({
      ...s,
      instruments: s.instruments.filter((_, i) => i !== index)
    }));
  }

  async save() {
    if (!this.set().name.trim()) return;
    this.saving.set(true);
    const result = await this.setService.upsertSet(this.set());
    this.saving.set(false);
    if (result) {
      this.router.navigate(['/instrument-sets', this.specialtyId()], {
        state: { specialtyName: this.specialtyName() }
      });
    }
  }

  goBack() {
    this.router.navigate(['/instrument-sets', this.specialtyId()], {
      state: { specialtyName: this.specialtyName() }
    });
  }
}
