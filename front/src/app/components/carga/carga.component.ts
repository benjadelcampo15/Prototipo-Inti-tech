import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { CargaService } from '../../services/carga.service';
import { PlantService } from '../../services/plant.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-carga',
  standalone: true,
  imports: [],
  templateUrl: './carga.component.html',
  styleUrls: ['./carga.component.scss'], // Corrección de 'styleUrl' a 'styleUrls'
})
export class CargaComponent {
  // private energyChart: Chart | null = null;
  private dailyChart: Chart | null = null;
  // private currentYear: number = new Date().getFullYear();

  constructor(
    private cargaService: CargaService,
    private plantService: PlantService
  ) {}

  ngOnInit() {
    this.createDailyChart([]);

    const plantSelect = document.getElementById(
      'plantSelect'
    ) as HTMLSelectElement;

    plantSelect.addEventListener('change', () => {
      this.showTips(plantSelect.value);
    });

    const fileInput = document.getElementById('fileUpload') as HTMLInputElement;

    const submitButton = document.getElementById(
      'submitButton'
    ) as HTMLButtonElement;

    submitButton.addEventListener('click', () => {
      if (!plantSelect.value) {
        swal({
          title: 'Error',
          text: 'Por favor, selecciona una planta',
          icon: 'error',
          buttons: {
            Aceptar: true,
          },
        });
      } else if (!fileInput.files || fileInput.files.length === 0) {
        swal({
          title: 'Error',
          text: 'Por favor, selecciona un archivo valido',
          icon: 'error',
          buttons: {
            Aceptar: true,
          },
        });
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
      return swal({
        title: 'Carga exitosa',
        text: 'Puedes verificar la carga en "Historial"',
        icon: 'success',
        buttons: {
          Aceptar: true,
        },
      });
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  }

  async showTips(plantSelect: string) {
    const response = this.plantService
      .getPlantStats(plantSelect)
      .then((data) => {
        console.log(data);

        let mes = data.mes_a_mes[data.mes_a_mes.length - 1].mes + 1;

        const meses: { [key: string]: string } = {
          '1': 'Enero',
          '2': 'Febrero',
          '3': 'Marzo',
          '4': 'Abril',
          '5': 'Mayo',
          '6': 'Junio',
          '7': 'Julio',
          '8': 'Agosto',
          '9': 'Septiembre',
          '10': 'Octubre',
          '11': 'Noviembre',
          '12': 'Diciembre',
        };

        if (mes in meses) {
          mes = meses[mes];
        }

        console.log(mes);

        const mesACargar = document.getElementById('mesACargar') as HTMLElement;
        const consejo = document.getElementById('consejos') as HTMLElement;

        consejo.textContent = `Se recomienda:`;
        mesACargar.textContent = `cargar el último mes sin datos: ${mes} de ${new Date().getFullYear()}`;
      });
  }
}
