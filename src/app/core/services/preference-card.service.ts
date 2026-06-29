import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface Specialty {
  id: string;
  name: string;
  sort_order: number;
}

export interface Surgeon {
  id: string;
  name: string;
  specialty_id: string;
  created_at?: string;
}

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
  surgeon_id: string;
  surgeon_name?: string;
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

  specialties = signal<Specialty[]>([]);
  surgeons = signal<Surgeon[]>([]);
  cards = signal<PreferenceCard[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  // Specialties
  async loadSpecialties() {
    const { data, error } = await this.supabase.client
      .from('specialties')
      .select('*')
      .order('sort_order');
    if (!error) this.specialties.set(data ?? []);
  }

  // Surgeons
  async loadSurgeonsBySpecialty(specialtyId: string) {
    this.loading.set(true);
    const { data, error } = await this.supabase.client
      .from('surgeons')
      .select('*')
      .eq('specialty_id', specialtyId)
      .order('name');
    this.loading.set(false);
    if (!error) this.surgeons.set(data ?? []);
  }

  async upsertSurgeon(surgeon: Omit<Surgeon, 'id' | 'created_at'>): Promise<Surgeon | null> {
    const { data, error } = await this.supabase.client
      .from('surgeons')
      .insert(surgeon)
      .select()
      .single();
    if (error) return null;
    return data;
  }

  async getSurgeon(id: string): Promise<Surgeon | null> {
    const { data, error } = await this.supabase.client
      .from('surgeons')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return data;
  }

  // Cards
  async loadCardsBySurgeon(surgeonId: string) {
    this.loading.set(true);
    this.error.set(null);
    const { data, error } = await this.supabase.client
      .from('preference_cards')
      .select('*')
      .eq('surgeon_id', surgeonId)
      .order('procedure_name');
    this.loading.set(false);
    if (error) this.error.set(error.message);
    else this.cards.set(data ?? []);
  }

  async loadCards() {
    this.loading.set(true);
    this.error.set(null);
    const { data, error } = await this.supabase.client
      .from('preference_cards')
      .select('*')
      .order('procedure_name');
    this.loading.set(false);
    if (error) this.error.set(error.message);
    else this.cards.set(data ?? []);
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
    return data;
  }

  async deleteCard(id: string): Promise<void> {
    await this.supabase.client
      .from('preference_cards')
      .delete()
      .eq('id', id);
    await this.loadCards();
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

  async deleteAnnotation(id: string): Promise<void> {
    await this.supabase.client
      .from('annotations')
      .delete()
      .eq('id', id);
  }

  async acceptAnnotation(annotation: Annotation, card: PreferenceCard): Promise<void> {
    const updatedCard = { ...card };
    const path = annotation.field_path;

    if (path === 'positioning') updatedCard.positioning = annotation.correction;
    else if (path === 'prep_solution') updatedCard.prep_solution = annotation.correction;
    else if (path === 'draping') updatedCard.draping = annotation.correction;
    else if (path.startsWith('instruments[')) {
      const index = parseInt(path.match(/\d+/)![0]);
      const instruments = [...updatedCard.instruments];
      instruments[index] = { ...instruments[index], name: annotation.correction };
      updatedCard.instruments = instruments;
    } else if (path.startsWith('sutures[')) {
      const index = parseInt(path.match(/\d+/)![0]);
      const sutures = [...updatedCard.sutures];
      sutures[index] = { ...sutures[index], type: annotation.correction };
      updatedCard.sutures = sutures;
    } else if (path.startsWith('equipment[')) {
      const index = parseInt(path.match(/\d+/)![0]);
      const equipment = [...updatedCard.equipment];
      equipment[index] = annotation.correction;
      updatedCard.equipment = equipment;
    }

    await this.upsertCard(updatedCard);
    await this.deleteAnnotation(annotation.id!);
  }
}