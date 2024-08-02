import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlantService {
  private apiUrl = 'https://prototipo-inti-tech.onrender.com/panels/stats';

  constructor(private http: HttpClient) {}

  async getPlantStats(
    plantName: string,
    year?: number,
    month?: number
  ): Promise<any> {
    try {
      const body: any = { name: plantName };

      if (year) {
        body.year = year;
      }

      if (month) {
        body.month = month;
      }

      const response = await firstValueFrom(
        this.http.post<any>(this.apiUrl, body)
      );
      return response;
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      throw error;
    }
  }
}
