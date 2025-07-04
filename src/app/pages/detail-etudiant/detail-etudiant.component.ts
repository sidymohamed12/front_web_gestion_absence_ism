import { Component, inject, OnInit } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { EtudiantService } from '../../core/services/impl/etudiant.service';
import { UtilisateurMobileDto } from '../../core/models/utilisateur.model';
import { Absence, TypeAbsence } from '../../core/models/absence.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatutJustification } from '../../core/models/justification.model';

@Component({
  selector: 'app-detail-etudiant',
  imports: [SidebarComponent, CommonModule, FormsModule],
  templateUrl: './detail-etudiant.component.html',
  styleUrl: './detail-etudiant.component.css',
})
export class DetailEtudiantComponent implements OnInit {
  private readonly etudiantService: EtudiantService = inject(EtudiantService);

  detailEtudiant?: UtilisateurMobileDto;
  filteredAbsence: Absence[] = [];
  selectedTypeAbsences = '';
  isLoading = true;
  error = '';

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadEtudiantDetails();
    console.log(this.detailEtudiant);
  }

  loadEtudiantDetails(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error = "ID d'absence non fourni";
      this.isLoading = false;
      return;
    }
    this.isLoading = true;
    this.error = '';

    this.etudiantService.getDetailEtudiant(id).subscribe({
      next: (data: UtilisateurMobileDto) => {
        this.detailEtudiant = data;
        this.filteredAbsence = data.absences || [];
        this.isLoading = false;
        console.log(data);
      },
      error: (err) => {
        console.error('Error:', err);
        this.error = "Erreur lors du chargement des détails de l'étudiant";
        this.isLoading = false;
      },
    });
  }

  getTotalAbsences(): number {
    return this.detailEtudiant?.absences?.length ?? 0;
  }

  getTotalRetards(): number {
    return (
      this.detailEtudiant?.absences?.filter(
        (absence) => absence.type === TypeAbsence.RETARD
      ).length ?? 0
    );
  }

  getTotalAbsencesCompletes(): number {
    return (
      this.detailEtudiant?.absences?.filter(
        (absence) => absence.type === TypeAbsence.ABSENCE_COMPLETE
      ).length ?? 0
    );
  }

  onFilterChange(): void {
    if (!this.detailEtudiant?.absences) {
      this.filteredAbsence = [];
      return;
    }

    if (this.selectedTypeAbsences === '') {
      this.filteredAbsence = this.detailEtudiant.absences;
    } else {
      this.filteredAbsence = this.detailEtudiant.absences.filter(
        (absence) => absence.type === this.selectedTypeAbsences
      );
    }
  }

  getFilteredAbsences(): Absence[] {
    if (!this.detailEtudiant?.absences) {
      return [];
    }

    if (this.selectedTypeAbsences === '') {
      return this.detailEtudiant.absences;
    }

    return this.detailEtudiant.absences.filter(
      (absence) => absence.type === this.selectedTypeAbsences
    );
  }

  getTypeAbsenceLabel(type: TypeAbsence): string {
    switch (type) {
      case TypeAbsence.RETARD:
        return 'Retard';
      case TypeAbsence.ABSENCE_COMPLETE:
        return 'Absence Complète';
      default:
        return 'Non défini';
    }
  }

  getJustificationLabel(justification: StatutJustification): string {
    switch (justification) {
      case StatutJustification.EN_ATTENTE:
        return 'En attente';
      case StatutJustification.VALIDEE:
        return 'Validée';
      case StatutJustification.REJETEE:
        return 'Rejetée';
      default:
        return 'Non Justifié';
    }
  }

  viewDetailAbsence(idAbsence: string) {
    return this.router.navigate(['/absences', idAbsence]);
  }

  goBack(): void {
    this.router.navigate(['/etudiants']);
  }

  getSkeletonItems(): number[] {
    return Array(5).fill(0);
  }
}
