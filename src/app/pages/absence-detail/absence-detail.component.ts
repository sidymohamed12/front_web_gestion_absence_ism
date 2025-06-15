import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { AbsenceDetail } from '../../core/models/absence.model';
import { AbsenceService } from '../../core/services/impl/absence.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/impl/auth.service';
import {
  JustificationTraitementRequest,
  StatutJustification,
} from '../../core/models/justification.model';
import { JustificationService } from '../../core/services/impl/justification.service';
import { SupabaseFileServiceService } from '../../core/services/impl/supabase-file-service.service';

@Component({
  selector: 'app-absence-detail',
  imports: [CommonModule, SidebarComponent, RouterModule],
  templateUrl: './absence-detail.component.html',
  styleUrl: './absence-detail.component.css',
})
export class AbsenceDetailComponent implements OnInit {
  private readonly absenceService: AbsenceService = inject(AbsenceService);
  private readonly justificationService: JustificationService =
    inject(JustificationService);
  public readonly superbaseFileService: SupabaseFileServiceService = inject(
    SupabaseFileServiceService
  );
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private readonly authService: AuthService = inject(AuthService);
  statutJustification?: StatutJustification;
  adminId: string | null = null;
  public StatutJustification = StatutJustification;

  absenceDetail: AbsenceDetail | null = null;
  isLoading = true;
  error: string | null = null;

  // Nouveaux états pour la gestion des téléchargements
  isDownloading = false;
  downloadingFiles: boolean[] = [];

  ngOnInit(): void {
    console.log(this.authService.getCurrentUser());
    this.loadAdminId();
    this.loadAbsenceDetail();
  }

  private loadAbsenceDetail(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error = "ID d'absence non fourni";
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.absenceService.getAbsenceDetail(id).subscribe({
      next: (data: AbsenceDetail) => {
        this.absenceDetail = data;
        this.isLoading = false;
        // Initialiser le tableau de téléchargement
        if (data.justification?.piecesJointes) {
          this.downloadingFiles = new Array(
            data.justification.piecesJointes.length
          ).fill(false);
        }
        console.log('Absence detail loaded:', data);
      },
      error: (err) => {
        console.error('Error loading absence detail:', err);
        this.error = "Erreur lors du chargement des détails de l'absence";
        this.isLoading = false;
      },
    });
  }

  private loadAdminId(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      console.error('Aucun utilisateur connecté');
      this.router.navigate(['/login']);
      return;
    }

    if (!user.realId) {
      console.error("L'utilisateur n'a pas d'ID administrateur");
      this.error = "Vous n'avez pas les droits nécessaires";
      return;
    }

    this.adminId = user.realId;
  }

  async viewAttachment(url: string, index: number): Promise<void> {
    return this.superbaseFileService.viewAttachment(
      url,
      index,
      this.downloadingFiles
    );
  }

  async downloadAttachment(url: string, index: number): Promise<void> {
    return this.superbaseFileService.downloadAttachment(
      url,
      index,
      this.downloadingFiles
    );
  }

  async downloadAllAttachments(): Promise<void> {
    return this.superbaseFileService.downloadAllAttachments(
      this.absenceDetail,
      this.isDownloading
    );
  }

  traiterJustification(statut: StatutJustification): void {
    if (!this.absenceDetail?.justification?.id) {
      console.error('ID de justification manquant', this.absenceDetail);
      this.error = 'Impossible de traiter : justification introuvable';
      return;
    }

    if (!this.adminId) {
      console.error('ID administrateur manquant', this.adminId);
      this.error = "Vous devez être connecté en tant qu'administrateur";
      return;
    }

    const request: JustificationTraitementRequest = {
      justificationId: this.absenceDetail.justification.id,
      statut: statut,
      adminValidateurId: this.adminId,
    };

    this.isLoading = true;
    this.justificationService.traiterJustification(request).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/absences']);
      },
      error: (err) => {
        console.error('Error processing justification:', err);
        this.isLoading = false;
        this.error = 'Erreur lors du traitement de la justification';
      },
    });
  }

  viewHistory(): void {
    if (this.absenceDetail?.absence) {
      console.log(
        'Viewing history for student:',
        this.absenceDetail.absence.etudiantMatricule
      );
    }
  }

  printDetail(): void {
    window.print();
  }

  exportDetail(): void {
    console.log('Exporting absence detail');
  }

  goBack(): void {
    this.router.navigate(['/absences']);
  }
}
