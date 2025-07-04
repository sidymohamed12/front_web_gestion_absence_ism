import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/impl/auth.service';
import { LoginResponse } from '../../core/models/utilisateur.model';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  currentUser?: LoginResponse;

  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.authService.currentUser$.subscribe((user) => {
        this.currentUser = user ?? undefined;
      });
    }
  }
}
