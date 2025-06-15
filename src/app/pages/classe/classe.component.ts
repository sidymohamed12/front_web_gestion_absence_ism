import { Component, inject } from '@angular/core';
import { Classe } from '../../core/models/Classe.model';
import { ClasseService } from '../../core/services/impl/classe.service';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-classe',
  imports: [SidebarComponent, CommonModule, FormsModule],
  templateUrl: './classe.component.html',
  styleUrl: './classe.component.css',
})
export class ClasseComponent {
  private readonly classeService: ClasseService = inject(ClasseService);
  private readonly router: Router = inject(Router);

  classes: Classe[] = [];
  filteredClasses: Classe[] = [];
  isLoading = true;
  error = '';
  searchTerm = '';
  selectedFiliere = '';

  get skeletonItems() {
    return Array(6).fill(0); // Affiche 6 lignes de skeleton par défaut
  }

  ngOnInit(): void {
    this.loadClasse();
  }

  loadClasse(): void {
    this.isLoading = true;
    this.error = '';

    this.classeService.getAllClasses().subscribe({
      next: (data: Classe[]) => {
        this.classes = data;
        this.filteredClasses = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.error = 'Erreur lors du chargement des classes';
        this.isLoading = false;
      },
    });
  }

  // Méthode pour filtrer les classes
  filterClasses(): void {
    this.filteredClasses = this.classes.filter((classe) => {
      const matchesSearch =
        !this.searchTerm ||
        classe.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        classe.filiere.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        classe.niveau.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesFiliere =
        !this.selectedFiliere ||
        classe.filiere.toLowerCase() === this.selectedFiliere.toLowerCase();

      return matchesSearch && matchesFiliere;
    });
  }

  // Méthode appelée lors de la saisie dans le champ de recherche
  onSearchChange(): void {
    this.filterClasses();
  }

  // Méthode appelée lors du changement de filière
  onFiliereChange(): void {
    this.filterClasses();
  }

  // Méthode pour réinitialiser les filtres
  resetFilters(): void {
    this.searchTerm = '';
    this.selectedFiliere = '';
    this.filteredClasses = this.classes;
  }

  onViewEtudiants(classeId: string): void {
    this.router.navigate(['/classes', classeId, 'etudiants']);
  }

  getSkeletonItems(): number[] {
    return Array(5).fill(0);
  }

  // Getter pour obtenir les filières uniques
  get uniqueFilieres(): string[] {
    return [...new Set(this.classes.map((classe) => classe.filiere))];
  }
}
