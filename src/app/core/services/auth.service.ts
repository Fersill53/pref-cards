import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private supabase = inject(SupabaseService);
  private router = inject(Router);

  user = signal<any>(null);
  userRole = signal<string | null>(null);
  loading = signal(true);

  async init() {
    const { data: { session } } = await this.supabase.client.auth.getSession();
    this.user.set(session?.user ?? null);
    if (session?.user) await this.loadRole();
    this.loading.set(false);

    this.supabase.client.auth.onAuthStateChange(async (event, session) => {
      this.user.set(session?.user ?? null);
      if (session?.user) {
        await this.loadRole();
        this.router.navigate(['/']);
      } else {
        this.userRole.set(null);
        this.router.navigate(['/login']);
      }
    });
  }

  private async loadRole() {
    const { data } = await this.supabase.client
      .from('user_roles')
      .select('user_role')
      .single();
    this.userRole.set(data?.user_role ?? 'tech');
  }

  get isAdmin() {
    return this.userRole() === 'admin';
  }

  async signIn(email: string, password: string): Promise<{ error: any }> {
    const { error } = await this.supabase.client.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  }

  async signOut() {
    await this.supabase.client.auth.signOut();
  }
}