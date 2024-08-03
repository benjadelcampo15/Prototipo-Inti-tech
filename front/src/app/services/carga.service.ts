import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CargaService {
  private apiUrl = 'https://prototipo-inti-tech.onrender.com/panels/upload'; // URL correcta

  constructor(private http: HttpClient) {}

  async cargarDatos(selectedPlant: string, file: File): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('panelName', selectedPlant); // Cambia 'name' a 'panelName'
      const response = await firstValueFrom(
        this.http.post<any>(this.apiUrl, formData)
      );
      return response;
    } catch (error) {
      console.error('Error al cargar los datos:', error);
      throw error;
    }
  }
}
