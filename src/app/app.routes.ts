import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './guards/auth.guard';
import { AbsencesComponent } from './pages/absences/absences.component';
import { ClasseComponent } from './pages/classe/classe.component';
import { AbsenceDetailComponent } from './pages/absence-detail/absence-detail.component';
import { VigilesComponent } from './pages/vigiles/vigiles.component';
import { EtudiantsComponent } from './pages/etudiants/etudiants.component';
import { ClasseEtudiantComponent } from './pages/classe-etudiant/classe-etudiant.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: LoginComponent },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: 'absences', component: AbsencesComponent },
      { path: 'absences/:id', component: AbsenceDetailComponent },
      { path: 'classes', component: ClasseComponent },
      { path: 'classes/:id/etudiants', component: ClasseEtudiantComponent },
      { path: 'vigiles', component: VigilesComponent },
      { path: 'etudiants', component: EtudiantsComponent },
      { path: 'logout', redirectTo: 'login' },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
