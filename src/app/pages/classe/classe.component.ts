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
  totalEtudiant = 0;

  isLoading = true;
  error = '';
  searchTerm = '';
  selectedFiliere = '';

  get skeletonItems() {
    return Array(4).fill(0);
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

  onSearchChange(): void {
    this.filterClasses();
  }

  onFiliereChange(): void {
    this.filterClasses();
  }

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

  get uniqueFilieres(): string[] {
    return [...new Set(this.classes.map((classe) => classe.filiere))];
  }

  public get Totaltudiant(): number {
    return this.filteredClasses.reduce(
      (sum, classe) => sum + (classe.effectif || 0),
      0
    );
  }
}
