import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLinkActive, RouterLink } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, RouterLinkActive, RouterOutlet, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private router: Router) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    })
  }


  async logear() {
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.loginForm.value.email,
          password: this.loginForm.value.password,
        }),
      });

      const data = await response.json();
      localStorage.setItem('token', data.token);

      if (data.error) {
        alert('Datos Incorrectos');
        console.error('Error during login:', data.error);
      } else {
        this.router.navigate(['/dashboard/historial']);
      }
    } catch (error) {
      swal({
        title: 'Error',
        text: 'Credenciales incorrectas',
        icon: 'error',
        buttons:{
          Aceptar: true
        },
      })

      console.error('Error during login:', error);
    }
  }
}
