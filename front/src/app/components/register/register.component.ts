import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
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
    ReactiveFormsModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private http: HttpClient) {
    this.registerForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$'),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.minLength(30),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(
          /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
        ),
      ]),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern('^[+]?([0-9 ]{1,15})$'),
      ]),
    });
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
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      phone: this.registerForm.value.phone,
    };

    try {
      const response = await firstValueFrom(
        this.http.post(
          'https://prototipo-inti-tech.onrender.com/register',
          body, // Envía el cuerpo directamente
          { headers }
        )
      );
      console.log('Response:', response);
      alert('Trabajador registrado correctamente');
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
