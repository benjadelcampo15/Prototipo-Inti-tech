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
    console.log('Stored Token:', token); // Verifica que el token está almacenado correctamente
  }

  async registrar() {
    console.log(this.name, this.email, this.password, this.phone);

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    // Limpieza del token para asegurarse de que no hay espacios
    const cleanedToken = token.trim();
    console.log('Token being sent:', cleanedToken); // Verifica el token

    const headers = new HttpHeaders({
      Authorization: `Bearer ${cleanedToken}`,
    });

    const body = {
      name: this.name,
      email: this.email,
      password: this.password,
      phone: this.phone,
    };

    console.log(body);
    console.log(headers);

    try {
      const response = await firstValueFrom(
        this.http.post(
          'http://localhost:3000/register',
          body, // Envía el cuerpo directamente
          { headers }
        )
      );
      console.log('Success:', response);
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
