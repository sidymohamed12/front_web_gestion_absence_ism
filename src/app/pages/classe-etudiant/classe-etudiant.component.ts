import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EtudiantListDto } from '../../core/models/utilisateur.model';
import { Classe } from '../../core/models/Classe.model';
import { ClasseService } from '../../core/services/impl/classe.service';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-classe-etudiant',
  imports: [CommonModule, RouterModule, FormsModule, SidebarComponent],
  templateUrl: './classe-etudiant.component.html',
  styleUrl: './classe-etudiant.component.css',
})
export class ClasseEtudiantComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly classeService = inject(ClasseService);

  classe: Classe | null = null;
  etudiants: EtudiantListDto[] = [];
  filteredEtudiants: EtudiantListDto[] = [];
  isLoading = true;
  error = '';
  searchTerm = '';
  classeId: string = '';

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.classeId = params['id'];
      if (this.classeId) {
        this.loadClasseDetails();
        this.loadEtudiants();
      } else {
        this.router.navigate(['/classes']);
      }
    });
  }

  loadClasseDetails(): void {
    // Récupérer les détails de la classe
    this.classeService.getClasseById(this.classeId).subscribe({
      next: (data: Classe) => {
        this.classe = data;
      },
      error: (err) => {
        console.error('Error loading classe details:', err);
        this.error = 'Erreur lors du chargement des détails de la classe';
        // Rediriger vers la liste des classes en cas d'erreur
        this.router.navigate(['/classes']);
      },
    });
  }

  loadEtudiants(): void {
    this.isLoading = true;
    this.error = '';

    // Récupérer la liste des étudiants de la classe
    this.classeService.getEtudiantsByClasseId(this.classeId).subscribe({
      next: (data: EtudiantListDto[]) => {
        this.etudiants = data;
        this.filteredEtudiants = [...data];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading etudiants:', err);
        this.error = 'Erreur lors du chargement des étudiants';
        this.isLoading = false;
      },
    });
  }

  filterEtudiants(): void {
    if (!this.searchTerm.trim()) {
      this.filteredEtudiants = [...this.etudiants];
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase().trim();
    this.filteredEtudiants = this.etudiants.filter(
      (etudiant) =>
        etudiant.nom.toLowerCase().includes(searchTermLower) ||
        etudiant.prenom.toLowerCase().includes(searchTermLower) ||
        etudiant.matricule.toLowerCase().includes(searchTermLower) ||
        etudiant.email.toLowerCase().includes(searchTermLower) ||
        `${etudiant.prenom} ${etudiant.nom}`
          .toLowerCase()
          .includes(searchTermLower)
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredEtudiants = [...this.etudiants];
  }

  getInitials(prenom: string, nom: string): string {
    const prenomInitial = prenom?.charAt(0)?.toUpperCase() || '';
    const nomInitial = nom?.charAt(0)?.toUpperCase() || '';
    return prenomInitial + nomInitial;
  }

  getSkeletonItems(): number[] {
    return Array(8).fill(0); // Affiche 8 lignes de skeleton par défaut
  }

  // Méthodes pour les actions (à implémenter selon vos besoins)
  onEditEtudiant(etudiantId: string): void {
    // Navigation vers la page d'édition de l'étudiant
    this.router.navigate(['/etudiants', etudiantId, 'edit']);
  }

  onViewEtudiantProfile(etudiantId: string): void {
    // Navigation vers le profil de l'étudiant
    this.router.navigate(['/etudiants', etudiantId]);
  }

  onDeleteEtudiant(etudiantId: string): void {
    // Logique pour supprimer un étudiant (avec confirmation)
    if (
      confirm('Êtes-vous sûr de vouloir supprimer cet étudiant de la classe ?')
    ) {
      // Appel au service pour supprimer l'étudiant
      console.log('Supprimer étudiant:', etudiantId);
      // Recharger la liste après suppression
      // this.loadEtudiants();
    }
  }

  onAddEtudiant(): void {
    // Navigation vers la page d'ajout d'étudiant avec l'ID de la classe
    this.router.navigate(['/etudiants/add'], {
      queryParams: { classeId: this.classeId },
    });
  }

  onExportList(): void {
    // Logique pour exporter la liste des étudiants
    console.log('Exporter la liste des étudiants');
    // Vous pouvez implémenter l'export en CSV, PDF, etc.
  }

  onGoBack(): void {
    this.router.navigate(['/classes']);
  }
}
