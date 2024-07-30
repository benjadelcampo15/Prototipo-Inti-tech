import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
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
export class RegisterComponent {
  constructor(private http: HttpClient) {}

  name = '';
  email = '';
  password = '';
  phone = '';

  async registrar() {
    console.log(this.name, this.email, this.password, this.phone);
    try {
      const response = await firstValueFrom(
        this.http.post('http://localhost:3000/register', {
          name: this.name,
          email: this.email,
          password: this.password,
          phone: this.phone,
        })
      );
      alert('Trabajador registrado correctamente');
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
