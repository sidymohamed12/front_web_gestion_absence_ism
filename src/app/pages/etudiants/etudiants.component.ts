import { Component, inject } from '@angular/core';
import { EtudiantService } from '../../core/services/impl/etudiant.service';
import { UtilisateurMobileDto } from '../../core/models/utilisateur.model';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-etudiants',
  imports: [SidebarComponent, CommonModule],
  templateUrl: './etudiants.component.html',
  styleUrl: './etudiants.component.css',
})
export class EtudiantsComponent {
  private readonly etudiantService: EtudiantService = inject(EtudiantService);
  private readonly router: Router = inject(Router);

  etudiants: UtilisateurMobileDto[] = [];
  isLoading = true;
  classCount = 0;

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
        this.classCount = [
          ...new Set(
            this.etudiants.filter((e) => e.classe).map((e) => e.classe)
          ),
        ].length;
      },
      error: (err) => {
        console.error('Error:', err);
        this.isLoading = false;
      },
    });
  }

  viewDetail(etudiantId: string) {
    this.router.navigate(['/etudiants', etudiantId]);
  }

  getSkeletonItems(): number[] {
    return Array(5).fill(0);
  }
}
