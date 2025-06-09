import { Component, inject } from '@angular/core';
import { Classe } from '../../core/models/Classe.model';
import { ClasseService } from '../../core/services/impl/classe.service';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-classe',
  imports: [SidebarComponent, CommonModule],
  templateUrl: './classe.component.html',
  styleUrl: './classe.component.css',
})
export class ClasseComponent {
  private readonly classeService: ClasseService = inject(ClasseService);

  classes: Classe[] = [];
  isLoading = true;
  error = '';

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
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.error = 'Erreur lors du chargement des classes';
        this.isLoading = false;
      },
    });
  }

  getSkeletonItems(): number[] {
    return Array(5).fill(0);
  }
}
