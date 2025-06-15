import { Component, inject } from '@angular/core';
import { UtilisateurMobileDto } from '../../core/models/utilisateur.model';
import { VigileService } from '../../core/services/impl/vigile.service';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vigiles',
  imports: [SidebarComponent, CommonModule, FormsModule],
  templateUrl: './vigiles.component.html',
  styleUrl: './vigiles.component.css',
})
export class VigilesComponent {
  private readonly vigileService: VigileService = inject(VigileService);

  vigiles: UtilisateurMobileDto[] = [];
  filteredVigiles: UtilisateurMobileDto[] = [];
  searchTerm: string = '';
  isLoading = true;

  ngOnInit(): void {
    this.loadVigiles();
  }

  loadVigiles(): void {
    this.isLoading = true;
    this.vigileService.getAllVigiles().subscribe({
      next: (data: UtilisateurMobileDto[]) => {
        this.vigiles = data;
        this.filteredVigiles = data;
        this.isLoading = false;
        console.log(this.vigiles);
      },
      error: (err) => {
        console.error('Error:', err);
        this.isLoading = false;
      },
    });
  }

  // Méthode pour filtrer les vigiles
  filterVigiles(): void {
    if (!this.searchTerm.trim()) {
      this.filteredVigiles = this.vigiles;
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase().trim();
    this.filteredVigiles = this.vigiles.filter(
      (vigile) =>
        vigile.nom.toLowerCase().includes(searchTermLower) ||
        vigile.prenom.toLowerCase().includes(searchTermLower)
    );
  }

  // Méthode appelée lors du changement de la valeur de recherche
  onSearchChange(): void {
    this.filterVigiles();
  }

  // Méthode pour effacer la recherche
  clearSearch(): void {
    this.searchTerm = '';
    this.filteredVigiles = this.vigiles;
  }

  getSkeletonItems(): number[] {
    return Array(5).fill(0);
  }
}
