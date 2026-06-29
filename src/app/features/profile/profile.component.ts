import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { SupabaseService } from '../../core/services/supabase.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  private router = inject(Router);
  protected authService = inject(AuthService);
  private supabase = inject(SupabaseService);

  currentPassword = signal('');
  newPassword = signal('');
  confirmPassword = signal('');
  saving = signal(false);
  successMsg = signal('');
  errorMsg = signal('');

  get email() {
    return this.authService.user()?.email ?? '';
  }

  get role() {
    return this.authService.userRole() ?? 'tech';
  }

  get roleLabel() {
    return this.role === 'admin' ? 'Admin' : 'Tech';
  }

  async changePassword() {
    this.successMsg.set('');
    this.errorMsg.set('');

    if (this.newPassword() !== this.confirmPassword()) {
      this.errorMsg.set('New passwords do not match.');
      return;
    }
    if (this.newPassword().length < 6) {
      this.errorMsg.set('New password must be at least 6 characters.');
      return;
    }

    this.saving.set(true);

    // Re-authenticate with current password first
    const { error: signInError } = await this.supabase.client.auth.signInWithPassword({
      email: this.email,
      password: this.currentPassword(),
    });

    if (signInError) {
      this.errorMsg.set('Current password is incorrect.');
      this.saving.set(false);
      return;
    }

    const { error } = await this.supabase.client.auth.updateUser({
      password: this.newPassword(),
    });

    this.saving.set(false);

    if (error) {
      this.errorMsg.set(error.message);
    } else {
      this.successMsg.set('Password updated successfully.');
      this.currentPassword.set('');
      this.newPassword.set('');
      this.confirmPassword.set('');
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
