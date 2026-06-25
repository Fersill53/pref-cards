import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface InstrumentItem {
  name: string;
  quantity: number;
  notes?: string;
}

export interface SutureItem {
  type: string;
  size: string;
  use?: string;
}

export interface PreferenceCard {
  id?: string;
  surgeon_name: string;
  procedure_name: string;
  specialty?: string;
  positioning?: string;
  prep_solution?: string;
  draping?: string;
  instruments: InstrumentItem[];
  sutures: SutureItem[];
  equipment: string[];
  notes?: string;
  version?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Annotation {
  id?: string;
  card_id: string;
  field_path: string;
  correction: string;
  author_name?: string;
  is_verified?: boolean;
  created_at?: string;
}

@Injectable({ providedIn: 'root' })
export class PreferenceCardService {
  private supabase = inject(SupabaseService);

  cards = signal<PreferenceCard[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  async loadCards() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const { data, error } = await this.supabase.client
        .from('preference_cards')
        .select('*')
        .order('surgeon_name');

      if (error) throw error;
      this.cards.set(data ?? []);
    } catch (err: any) {
      this.error.set(err.message);
    } finally {
      this.loading.set(false);
    }
  }

  async getCard(id: string): Promise<PreferenceCard | null> {
    const { data, error } = await this.supabase.client
      .from('preference_cards')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  }

  async upsertCard(card: PreferenceCard): Promise<PreferenceCard | null> {
    const { data, error } = await this.supabase.client
      .from('preference_cards')
      .upsert({ ...card, updated_at: new Date().toISOString() })
      .select()
      .single();

    if (error) return null;
    await this.loadCards();
    return data;
  }

  async addAnnotation(annotation: Omit<Annotation, 'id' | 'created_at'>): Promise<Annotation | null> {
    const { data, error } = await this.supabase.client
      .from('annotations')
      .insert(annotation)
      .select()
      .single();

    if (error) return null;
    return data;
  }

  async getAnnotations(cardId: string): Promise<Annotation[]> {
    const { data, error } = await this.supabase.client
      .from('annotations')
      .select('*')
      .eq('card_id', cardId)
      .order('created_at', { ascending: false });

    if (error) return [];
    return data ?? [];
  }

  async deleteCard(id: string): Promise<void> {
    await this.supabase.client
      .from('preference_cards')
      .delete()
      .eq('id', id);
    await this.loadCards();
  }
}