import { Component } from '@angular/core';
import { AuthService } from '../../core/services/impl/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email = '';
  motDePasse = '';
  error = '';
  isLoading = false;

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router
  ) {}

  onSubmit() {
    this.error = '';
    this.isLoading = true;

    this.auth
      .login({ email: this.email, motDePasse: this.motDePasse })
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          this.router.navigate(['/absences']);
        },
        error: (error) => {
          this.isLoading = false;
          this.error = 'Email ou mot de passe incorrect';
        },
      });
  }
}
