import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PreferenceCardService, Specialty } from '../../../core/services/preference-card.service';

@Component({
  selector: 'app-specialty-list',
  standalone: true,
  imports: [],
  templateUrl: './specialty-list.component.html',
})
export class SpecialtyList implements OnInit {
  private router = inject(Router);
  protected cardService = inject(PreferenceCardService);

  async ngOnInit() {
    await this.cardService.loadSpecialties();
  }

  goToSurgeons(specialty: Specialty) {
    this.router.navigate(['/specialty', specialty.id, 'surgeons'], {
      state: { specialtyName: specialty.name }
    });
  }
}