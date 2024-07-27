import { Component, OnInit } from '@angular/core';
import { CargaComponent } from '../carga/carga.component';
import { HistorialComponent } from '../historial/historial.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

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
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  mostrarBoton: boolean = true;
  token = localStorage.getItem('token');

  ngOnInit() {
    this.verificarCondicion();
  }

  verificarCondicion() {
    if (!this.token) {
      this.mostrarBoton = false;
    } else {
      this.mostrarBoton = true;
    }
    // // Lógica para verificar la condición
    // this.mostrarBoton = false; // o false, dependiendo de tu condición
    // console.log('mostrarBoton:', this.mostrarBoton); // Verificar valor en la consola
  }
}
