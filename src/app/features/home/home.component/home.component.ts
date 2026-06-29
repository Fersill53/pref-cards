import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  private router = inject(Router);

  goToPreferenceCards() {
    this.router.navigate(['/specialties']);
  }

  goToInstrumentSets() {
    // coming soon
  }
}