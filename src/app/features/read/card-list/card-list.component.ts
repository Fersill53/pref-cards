import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PreferenceCardService } from '../../../core/services/preference-card.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './card-list.component.html',
})
export class CardListComponent implements OnInit {
  protected cardService = inject(PreferenceCardService);
  protected authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  surgeonId = signal('');
  surgeonName = signal('');
  specialtyId = signal('');
  specialtyName = signal('');
  searchQuery = signal('');

  filteredCards = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.cardService.cards();
    return this.cardService.cards().filter(card =>
      card.procedure_name.toLowerCase().includes(query) ||
      (card.notes ?? '').toLowerCase().includes(query)
    );
  });

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('surgeonId') ?? '';
    this.surgeonId.set(id);
    const nav = history.state;
    this.surgeonName.set(nav?.surgeonName ?? 'Surgeon');
    this.specialtyId.set(nav?.specialtyId ?? '');
    this.specialtyName.set(nav?.specialtyName ?? '');
    if (id) await this.cardService.loadCardsBySurgeon(id);
  }

  goToCard(id: string) {
    this.router.navigate(['/cards', id]);
  }

  goToEdit(id?: string) {
    if (id) {
      this.router.navigate(['/edit', id]);
    } else {
      this.router.navigate(['/edit'], {
        state: {
          surgeonId: this.surgeonId(),
          surgeonName: this.surgeonName(),
          specialtyId: this.specialtyId(),
          specialtyName: this.specialtyName(),
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/specialty', this.specialtyId(), 'surgeons'], {
      state: { specialtyName: this.specialtyName() }
    });
  }

  clearSearch() {
    this.searchQuery.set('');
  }
}