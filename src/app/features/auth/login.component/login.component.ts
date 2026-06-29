import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private authService = inject(AuthService);

  email = signal('');
  password = signal('');
  loading = signal(false);
  error = signal<string | null>(null);
  showPassword = signal(false);

  async signIn() {
    if (!this.email().trim() || !this.password().trim()) return;
    this.loading.set(true);
    this.error.set(null);
    const { error } = await this.authService.signIn(this.email(), this.password());
    this.loading.set(false);
    if (error) this.error.set(error.message);
  }
}