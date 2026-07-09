import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface InstrumentSet {
  id?: string;
  name: string;
  specialty_id: string;
  instruments: { name: string; quantity: number; notes?: string }[];
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({ providedIn: 'root' })
export class InstrumentSetService {
  private supabase = inject(SupabaseService);

  sets = signal<InstrumentSet[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  async loadSetsBySpecialty(specialtyId: string) {
    if (!specialtyId) return;
    this.loading.set(true);
    this.error.set(null);
    const { data, error } = await this.supabase.client
      .from('instrument_sets')
      .select('*')
      .eq('specialty_id', specialtyId)
      .order('name');
    this.loading.set(false);
    if (error) this.error.set(error.message);
    else this.sets.set(data ?? []);
  }

  async getSet(id: string): Promise<InstrumentSet | null> {
    const { data, error } = await this.supabase.client
      .from('instrument_sets')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return data;
  }

  async upsertSet(set: InstrumentSet): Promise<InstrumentSet | null> {
    const { data, error } = await this.supabase.client
      .from('instrument_sets')
      .upsert({ ...set, updated_at: new Date().toISOString() })
      .select()
      .single();
    if (error) { console.error('upsertSet error:', error); return null; }
    return data;
  }

  async deleteSet(id: string): Promise<void> {
    await this.supabase.client
      .from('instrument_sets')
      .delete()
      .eq('id', id);
  }
}
