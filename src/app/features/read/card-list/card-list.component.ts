import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PreferenceCardService } from '../../../core/services/preference-card.service';

@Component({
  selector: 'app-card-list',
  imports: [FormsModule],
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.css',
})
export class CardListComponent implements OnInit {
  protected cardService = inject(PreferenceCardService);
  private router = inject(Router);

  searchQuery = signal('');

  filteredCards = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.cardService.cards();
    return this.cardService.cards().filter(card => 
      card.surgeon_name.toLowerCase().includes(query) ||
      card.procedure_name.toLowerCase().includes(query) ||
      (card.specialty ?? '').toLowerCase().includes(query)
    );
  });

  ngOnInit() {
    this.cardService.loadCards();
  }

  goToCard(id: string) {
    this.router.navigate(['/cards', id]);
  }

  goToEdit(id?: string) {
    if(id) {
      this.router.navigate(['/edit', id]);
    } else {
      this.router.navigate(['/edit']);
    }
  }

  clearSearch() {
    this.searchQuery.set('');
  }
}
