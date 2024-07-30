import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { CargaService } from '../../services/carga.service';

@Component({
  selector: 'app-carga',
  standalone: true,
  imports: [],
  templateUrl: './carga.component.html',
  styleUrls: ['./carga.component.scss'], // Corrección de 'styleUrl' a 'styleUrls'
})
export class CargaComponent {
  private energyChart: Chart | null = null;
  private dailyChart: Chart | null = null;
  private currentYear: number = new Date().getFullYear();

  constructor(private cargaService: CargaService) {}

  ngOnInit() {
    this.createDailyChart([]);

    const plantSelect = document.getElementById(
      'plantSelect'
    ) as HTMLSelectElement;

    const fileInput = document.getElementById('fileUpload') as HTMLInputElement;

    const submitButton = document.getElementById(
      'submitButton'
    ) as HTMLButtonElement;

    submitButton.addEventListener('click', () => {
      if (!plantSelect.value) {
        return alert('Por favor, selecciona una planta');
      }

      if (!fileInput.files || fileInput.files.length === 0) {
        return alert('Por favor, selecciona un archivo');
      }

      if (fileInput.files && fileInput.files.length > 0) {
        this.fetchPlantStats(plantSelect.value, fileInput.files[0]);
      }
    });
  }

  async createDailyChart(dailyData: any[]) {
    const ctx = document.getElementById('dailyChart') as HTMLCanvasElement;

    if (this.dailyChart) {
      this.dailyChart.destroy();
    }

    const labels = dailyData.map((data) => data.dia.toString());
    const generatedData = dailyData.map((data) => data.energiaGenerada);

    this.dailyChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Energía Generada',
            data: generatedData,
            backgroundColor: 'rgba(255, 165, 0, 0.9)',
            borderColor: 'rgba(255, 140, 0, 1)',
            borderWidth: 1,
            barPercentage: 0.6,
            categoryPercentage: 0.8,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.dataset.label || '';
                const value = context.raw;
                return `${label}: ${value} kWh`;
              },
            },
          },
        },
        scales: {
          x: {
            stacked: false,
            grid: {
              display: true,
              color: '#d3d3d3',
            },
            ticks: {
              autoSkip: true,
              maxRotation: 45,
              minRotation: 0,
            },
          },
          y: {
            stacked: false,
            beginAtZero: true,
            grid: {
              display: true,
              color: '#d3d3d3',
            },
            title: {
              display: true,
              text: 'Energía (kWh)',
            },
          },
        },
      },
    });
  }

  async fetchPlantStats(selectedPlant: string, file: File) {
    try {
      const response = await this.cargaService.cargarDatos(selectedPlant, file);

      const arrayDeDias: any[] = [];

      for (const dia in response) {
        arrayDeDias.push({
          dia: response[dia].day,
          energiaGenerada: response[dia].energyGenerated,
        });
      }

      const mesCargado = document.getElementById('mesCargado') as HTMLElement;
      const añoCargado = document.getElementById('añoCargado') as HTMLElement;
      const fechaCargado = document.getElementById(
        'fechaCargado'
      ) as HTMLElement;

      fechaCargado.textContent = `Fecha de carga: `;
      mesCargado.textContent = `Mes: ${response[0].month}`;
      añoCargado.textContent = `Año: ${response[0].year}`;

      await this.createDailyChart(arrayDeDias);
      return alert(
        'Carga exitosa! Puede ver los datos actualizados en el historial'
      );
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  }
}
