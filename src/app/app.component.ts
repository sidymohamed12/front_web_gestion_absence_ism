import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/impl/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'angular_gestion_absence';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.authService.autoLogin().subscribe((success) => {
      if (!success) {
        console.log('Utilisateur non connecté ou session expirée');
      } else {
        console.log('Utilisateur restauré via cookie');
      }
    });
  }
}
