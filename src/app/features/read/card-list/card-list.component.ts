import { Component, inject, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PreferenceCardService } from '../../../core/services/preference-card.service';

@Component({
  selector: 'app-card-list',
  imports: [],
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.css',
})
export class CardListComponent implements OnInit {
  protected cardService = inject(PreferenceCardService);
  private router = inject(Router);

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
}
