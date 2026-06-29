import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PreferenceCardService, Specialty } from '../../../core/services/preference-card.service';

interface SpecialtyDisplay {
  name: string;
  icon: string;
  color: string;
  bg: string;
}

const SPECIALTY_META: Record<string, SpecialtyDisplay> = {
  'Spine':            { name: 'Spine',            icon: 'ti-bone',                color: '#378ADD', bg: '#E6F1FB' },
  'General Surgery':  { name: 'General Surgery',  icon: 'ti-stethoscope',         color: '#3B6D11', bg: '#EAF3DE' },
  'Orthopedics':      { name: 'Orthopedics',      icon: 'ti-hammer',              color: '#BA7517', bg: '#FAEEDA' },
  'Neurosurgery':     { name: 'Neurosurgery',      icon: 'ti-brain',               color: '#534AB7', bg: '#EEEDFE' },
  'Cardiovascular':   { name: 'Cardiovascular',   icon: 'ti-heart-rate-monitor',  color: '#A32D2D', bg: '#FCEBEB' },
  'Urology':          { name: 'Urology',           icon: 'ti-droplet',             color: '#185FA5', bg: '#E6F1FB' },
  'Gynecology':       { name: 'Gynecology',        icon: 'ti-gender-female',       color: '#0F6E56', bg: '#E1F5EE' },
  'Plastics':         { name: 'Plastics',          icon: 'ti-scissors',            color: '#854F0B', bg: '#FAEEDA' },
  'Vascular':         { name: 'Vascular',          icon: 'ti-activity',            color: '#993C1D', bg: '#FAECE7' },
};

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

  getMeta(name: string): SpecialtyDisplay {
    return SPECIALTY_META[name] ?? { name, icon: 'ti-medical-cross', color: '#378ADD', bg: '#E6F1FB' };
  }

  goToSurgeons(specialty: Specialty) {
    this.router.navigate(['/specialty', specialty.id, 'surgeons'], {
      state: { specialtyName: specialty.name }
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
