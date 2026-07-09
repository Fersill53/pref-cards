import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InstrumentSetService, InstrumentSet } from '../../../core/services/instrument-set.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-instrument-set-view',
  standalone: true,
  imports: [],
  templateUrl: './instrument-set-view.component.html',
})
export class InstrumentSetView implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private setService = inject(InstrumentSetService);
  protected authService = inject(AuthService);

  set = signal<InstrumentSet | null>(null);
  loading = signal(true);
  specialtyId = signal('');
  specialtyName = signal('');
  showDeleteConfirm = signal(false);
  deleting = signal(false);

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    const nav = history.state;
    this.specialtyId.set(nav?.specialtyId ?? '');
    this.specialtyName.set(nav?.specialtyName ?? '');
    const data = await this.setService.getSet(id);
    this.set.set(data);
    this.loading.set(false);
  }

  goToEdit() {
    this.router.navigate(['/instrument-sets', 'edit', this.set()!.id], {
      state: { specialtyId: this.specialtyId(), specialtyName: this.specialtyName() }
    });
  }

  goBack() {
    this.router.navigate(['/instrument-sets', this.specialtyId()], {
      state: { specialtyName: this.specialtyName() }
    });
  }

  async deleteSet() {
    this.deleting.set(true);
    await this.setService.deleteSet(this.set()!.id!);
    this.deleting.set(false);
    this.goBack();
  }
}
