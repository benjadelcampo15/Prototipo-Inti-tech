import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { PlantService } from '../../services/plant.service';

@Component({
  selector: 'app-historial',
  standalone: true,
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.scss'],
})
export class HistorialComponent implements OnInit {
  private energyChart: Chart | null = null;
  private dailyChart: Chart | null = null;
  private currentYear: number = new Date().getFullYear();

  constructor(private plantService: PlantService) {}

  ngOnInit() {
    this.createEnergyChart([]);
    this.createDailyChart([]);

    const plantSelect = document.getElementById(
      'plantSelect'
    ) as HTMLSelectElement;
    const monthSelect = document.getElementById('month') as HTMLSelectElement;
    const yearSelect = document.getElementById('year') as HTMLSelectElement;
    const submitButton = document.getElementById(
      'submitButton'
    ) as HTMLButtonElement;

    plantSelect.addEventListener('change', () => {
      this.fetchPlantStats();
    });

    submitButton.addEventListener('click', () => {
      this.fetchPlantStatsWithMonthYear();
    });
  }

  createEnergyChart(monthlyData: any[]) {
    const ctx = document.getElementById('energyChart') as HTMLCanvasElement;

    if (this.energyChart) {
      this.energyChart.destroy();
    }

    const labels = monthlyData.map((data) => data.mes);
    const generatedData = monthlyData.map(
      (data) => data.energiaGeneradaAcumulada
    );
    const expectedData = monthlyData.map((data) => data.pvsyst);

    this.energyChart = new Chart(ctx, {
      data: {
        labels: labels,
        datasets: [
          {
            type: 'bar',
            label: 'Energía Generada',
            data: generatedData,
            backgroundColor: 'rgba(255, 165, 0, 0.9)',
            borderColor: 'rgba(255, 140, 0, 1)',
            borderWidth: 1,
            barPercentage: 1,
            categoryPercentage: 0.5,
            order: 2,
          },
          {
            type: 'line',
            label: 'Energía Esperada',
            data: expectedData,
            fill: false,
            borderColor: 'rgba(25, 118, 210, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(25, 118, 210, 1)',
            pointBorderColor: 'rgba(21, 101, 192, 1)',
            pointRadius: 3,
            tension: 0.1,
            order: 1,
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

  createDailyChart(dailyData: any[]) {
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

  async fetchPlantStats() {
    try {
      const plantSelect = document.getElementById(
        'plantSelect'
      ) as HTMLSelectElement;

      const selectedPlant = plantSelect.value;

      if (!selectedPlant) {
        return;
      }

      const response = await this.plantService.getPlantStats(selectedPlant);

      console.log('Datos recibidos del backend:', response);

      this.createEnergyChart(response.mes_a_mes);
      this.createDailyChart(response.dia_a_dia);

      const ultimoMes = response.mes_a_mes[response.mes_a_mes.length - 1];

      let energiaTotalMes = 0;

      for (const dia of response.dia_a_dia) {
        // sumar energia generada por dia y guardarlo en energiaTotalMes
        energiaTotalMes += dia.energiaGenerada;
      }

      const data = {
        energiaGeneradaAnual: response.energiaGeneradaAnual,
        energiaTotalMes: Math.round(energiaTotalMes),
        ultimoMes: ultimoMes,
      };

      this.updateData(data);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  }

  async fetchPlantStatsWithMonthYear() {
    try {
      const plantSelect = document.getElementById(
        'plantSelect'
      ) as HTMLSelectElement;
      const monthSelect = document.getElementById('month') as HTMLSelectElement;
      const yearSelect = document.getElementById('year') as HTMLSelectElement;

      const selectedPlant = plantSelect.value;
      const selectedMonth = monthSelect.value;
      const selectedYear = yearSelect.value;

      if (!selectedPlant) {
        return;
      }

      if (selectedMonth && !selectedYear) {
        alert('Por favor, seleccione un año.');
        return;
      }

      if (!selectedMonth && selectedYear) {
        alert('Por favor, seleccione un mes.');
        return;
      }

      const response = await this.plantService.getPlantStats(
        selectedPlant,
        selectedYear ? parseInt(selectedYear, 10) : undefined,
        selectedMonth ? parseInt(selectedMonth, 10) : undefined
      );

      console.log('Datos recibidos del backend:', response);

      this.createEnergyChart(response.mes_a_mes);
      this.createDailyChart(response.dia_a_dia);

      const ultimoMes = response.mes_a_mes[response.mes_a_mes.length - 1];

      let energiaTotalMes = 0;

      for (const dia of response.dia_a_dia) {
        // sumar energia generada por dia y guardarlo en energiaTotalMes
        energiaTotalMes += dia.energiaGenerada;
      }

      const data = {
        energiaGeneradaAnual: response.energiaGeneradaAnual,
        energiaTotalMes: Math.round(energiaTotalMes),
        ultimoMes: ultimoMes,
      };

      this.updateData(data);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  }

  updateData(data: any) {
    let ultimoMes = data.ultimoMes.mes;

    const totalAnual = document.getElementById('totalAnual') as HTMLElement;
    const totalMensual = document.getElementById('totalMes') as HTMLElement;

    const año = document.getElementById('año') as HTMLSelectElement;
    const optionsAño = document.getElementById('year') as HTMLSelectElement;

    const mes = document.getElementById('mes') as HTMLSelectElement;
    const optionsMes = document.getElementById('month') as HTMLSelectElement;

    let valorAño = optionsAño.value;
    let valorMes = optionsMes.value;

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

    if (valorMes in meses) {
      valorMes = meses[valorMes];
    } else {
      valorMes = meses[ultimoMes] || `${ultimoMes}`;
    }

    año.innerText = `${valorAño || new Date().getFullYear()}`;
    mes.innerText = `${valorMes}`;
    totalAnual.innerText = `Total generado en el año: ${data.energiaGeneradaAnual} kWh`;
    totalMensual.innerText = `Energía total del mes: ${data.energiaTotalMes} kWh`;
  }
}
