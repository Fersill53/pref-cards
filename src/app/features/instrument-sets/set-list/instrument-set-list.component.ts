import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InstrumentSetService } from '../../../core/services/instrument-set.service';
import { PreferenceCardService } from '../../../core/services/preference-card.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-instrument-set-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './instrument-set-list.component.html',
})
export class InstrumentSetList implements OnInit {
  protected setService = inject(InstrumentSetService);
  protected cardService = inject(PreferenceCardService);
  protected authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  specialtyId = signal('');
  specialtyName = signal('');
  searchQuery = signal('');

  filteredSets = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.setService.sets();
    return this.setService.sets().filter(s =>
      s.name.toLowerCase().includes(query) ||
      (s.notes ?? '').toLowerCase().includes(query)
    );
  });

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('specialtyId') ?? '';
    this.specialtyId.set(id);
    const nav = history.state;
    this.specialtyName.set(nav?.specialtyName ?? 'Specialty');
    if (id) await this.setService.loadSetsBySpecialty(id);
  }

  goToSet(id: string) {
    this.router.navigate(['/instrument-sets', 'view', id], {
      state: { specialtyId: this.specialtyId(), specialtyName: this.specialtyName() }
    });
  }

  goToEdit(id?: string) {
    if (id) {
      this.router.navigate(['/instrument-sets', 'edit', id]);
    } else {
      this.router.navigate(['/instrument-sets', 'edit'], {
        state: { specialtyId: this.specialtyId(), specialtyName: this.specialtyName() }
      });
    }
  }

  goBack() {
    this.router.navigate(['/instrument-sets']);
  }

  clearSearch() {
    this.searchQuery.set('');
  }
}
