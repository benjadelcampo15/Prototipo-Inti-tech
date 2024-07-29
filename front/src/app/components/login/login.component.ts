import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLinkActive, RouterLink } from '@angular/router';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(private http: HttpClient, private router: Router) {}

  email = '';

  password = '';

  async logear() {
    console.log(this.email, this.password);
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.email,
          password: this.password,
        }),
      });

      const data = await response.json();
      localStorage.setItem('token', data.token);
      console.log(data);

      if (data.error) {
        console.error('Error during login:', data.error);
      } else {
        this.router.navigate(['/dashboard/historial']);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  }
}
