import { Component, OnInit } from '@angular/core';
import { CargaComponent } from '../carga/carga.component';
import { HistorialComponent } from '../historial/historial.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CargaComponent,
    HistorialComponent,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    CommonModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  mostrarBoton: boolean = false;
  token = localStorage.getItem('token');

  constructor(private authservice: AuthService) {}

  ngOnInit() {
    this.verificarCondicion();
  }

  verificarCondicion() {
    this.authservice.isAdmin().then(isAdmin => {
      this.mostrarBoton = isAdmin;
    });
    // // Lógica para verificar la condición
    // this.mostrarBoton = false; // o false, dependiendo de tu condición
    // console.log('mostrarBoton:', this.mostrarBoton); // Verificar valor en la consola
  }
}
