import { Component, inject } from '@angular/core';
import { EtudiantService } from '../../core/services/impl/etudiant.service';
import { UtilisateurMobileDto } from '../../core/models/utilisateur.model';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-etudiants',
  imports: [SidebarComponent, CommonModule],
  templateUrl: './etudiants.component.html',
  styleUrl: './etudiants.component.css',
})
export class EtudiantsComponent {
  private readonly etudiantService: EtudiantService = inject(EtudiantService);

  etudiants: UtilisateurMobileDto[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.loadEtudiants();
    console.log(this.etudiants);
  }

  loadEtudiants(): void {
    this.isLoading = true;
    this.etudiantService.getAllEtudians().subscribe({
      next: (data: UtilisateurMobileDto[]) => {
        this.etudiants = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.isLoading = false;
      },
    });
  }

  getSkeletonItems(): number[] {
    return Array(5).fill(0);
  }
}
