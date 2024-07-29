import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private urlBack = `http://localhost:3000/users`;

  constructor(private http: HttpClient) {}

  async isAdmin() {
    const store = localStorage.getItem('token');
    console.log(store);
    const token = store?.toString();

    if (token) {
      const decodedToken: JwtPayload = jwtDecode(token) as JwtPayload;
      const { id } = decodedToken;
      try {
        const res = this.http
          .get<any>(`${this.urlBack}/${id}`)
          .pipe(map((response) => response));
        const data = await firstValueFrom(res);
        console.log(data);
        if (data.role === 'admin') {
          return true;
        }
      } catch (error) {
        console.log(error);
      }
    }
    return false;
  }
}
