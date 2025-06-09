import { Component, inject } from '@angular/core';
import { UtilisateurMobileDto } from '../../core/models/utilisateur.model';
import { VigileService } from '../../core/services/impl/vigile.service';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vigiles',
  imports: [SidebarComponent, CommonModule],
  templateUrl: './vigiles.component.html',
  styleUrl: './vigiles.component.css',
})
export class VigilesComponent {
  private readonly vigileService: VigileService = inject(VigileService);

  vigiles: UtilisateurMobileDto[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.loadVigiles();
    console.log(this.vigiles);
  }

  loadVigiles(): void {
    this.isLoading = true;
    this.vigileService.getAllVigiles().subscribe({
      next: (data: UtilisateurMobileDto[]) => {
        this.vigiles = data;
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
