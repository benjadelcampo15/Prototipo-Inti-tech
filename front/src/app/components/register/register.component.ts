import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    CommonModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  constructor(private http: HttpClient) {}

  name = '';
  email = '';
  password = '';
  phone = '';

  ngOnInit() {
    const token = localStorage.getItem('token');
  }

  async registrar() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    // Limpieza del token para asegurarse de que no hay espacios
    const cleanedToken = token.trim();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${cleanedToken}`,
    });

    const body = {
      name: this.name,
      email: this.email,
      password: this.password,
      phone: this.phone,
    };

    try {
      const response = await firstValueFrom(
        this.http.post(
          'http://localhost:3000/register',
          body, // Envía el cuerpo directamente
          { headers }
        )
      );
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
