import { Component, inject, OnInit } from '@angular/core';
import { AbsenceService } from '../../core/services/impl/absence.service';
import { Absence, TypeAbsence } from '../../core/models/absence.model';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-absences',
  standalone: true,
  imports: [CommonModule, SidebarComponent, FormsModule],
  templateUrl: './absences.component.html',
  styleUrl: './absences.component.css',
})
export class AbsencesComponent implements OnInit {
  private readonly absenceService: AbsenceService = inject(AbsenceService);
  private readonly router: Router = inject(Router);

  absences: Absence[] = [];
  totalPages = 0;
  currentPage = 0;
  totalItems = 0;
  pages: number[] = [];
  public TypeAbsence = TypeAbsence;
  selectedType?: TypeAbsence;
  selectedDate?: Date;

  isLoading = true;

  ngOnInit(): void {
    this.loadAbsences();
    console.log(this.absences);
  }

  loadAbsences(page: number = 0): void {
    this.isLoading = true;
    this.absenceService
      .getAbsence(page, this.selectedType, this.selectedDate)
      .subscribe({
        next: (response) => {
          this.absences = response.results;
          this.totalItems = response.totalItems;
          this.totalPages = response.totalPages;
          this.currentPage = response.currentPage;
          this.pages = Array.from({ length: response.totalPages }, (_, i) => i);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erreur:', err);
          this.isLoading = false;
        },
      });
  }

  onTypeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedType = select.value
      ? (select.value as TypeAbsence)
      : undefined;
    this.loadAbsences(0); // Reset à la première page
  }

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedDate = input.value ? new Date(input.value) : undefined;
    this.loadAbsences(0); // Reset à la première page
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.loadAbsences(page);
    }
  }

  nextPage(): void {
    this.changePage(this.currentPage + 1);
  }

  previousPage(): void {
    this.changePage(this.currentPage - 1);
  }

  getSkeletonItems(): number[] {
    return Array(5).fill(0);
  }

  viewDetail(absenceId: string) {
    this.router.navigate(['/absences', absenceId]);
  }
}
