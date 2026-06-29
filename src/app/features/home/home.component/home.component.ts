import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  private router = inject(Router);
  protected authService = inject(AuthService);

  goToPreferenceCards() {
    this.router.navigate(['/specialties']);
  }

  goToInstrumentSets() {
    // coming soon
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  async signOut() {
    await this.authService.signOut();
  }
}