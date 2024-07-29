import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatsDto } from 'src/dtos/stats.dto';
import { Repository } from 'typeorm';
import { Panel } from 'src/entities/panel.entity';
import { pvsystPreloadRepository } from './pvsystPreload.repository';
import { statsPreloadRepository } from './statsPreload.repository';
import { plantas } from 'src/utils/plantas/plantas';

import { bodegasSalcobrand } from 'src/utils/bodegasSalcobrand/bodegasSalcobrand';
import { centrovet255 } from 'src/utils/centrovet255/centrovet';
import { centrovet601 } from 'src/utils/centrovet601/centrovet601';
import { ekonoelsalto } from 'src/utils/ekonoelsalto/eknoelsalto';
import { Stats } from 'src/entities/stats.entity';

const XLSX = require('xlsx');

@Injectable()
export class PanelRepository implements OnModuleInit {
  constructor(
    private readonly pvsystPreloadRepository: pvsystPreloadRepository,
    private readonly statsPreloadRepository: statsPreloadRepository,
    @InjectRepository(Panel)
    private readonly panelRepository: Repository<Panel>,
    @InjectRepository(Stats)
    private readonly statsRepository: Repository<Stats>,
  ) {}

  async onModuleInit(): Promise<void> {
    for (const planta of plantas) {
      console.log(planta);
      const panel = await this.panelRepository.findOne({
        where: { name: planta.name },
      });

      if (!panel) {
        const newPanel = this.panelRepository.create({
          name: planta.name,
          inversor: planta.inversor,
          logo: planta.logo,
          address: planta.address,
        });

        await this.panelRepository.save(newPanel);

        switch (newPanel.name) {
          case 'BODEGAS SALCOBRAND':
            await this.pvsystPreloadRepository.pvsystBodegasSalcobrand();
            await this.statsPreloadRepository.saveStats(
              'BODEGAS SALCOBRAND',
              bodegasSalcobrand,
            );
            break;
          case 'CENTROVET 255 AUTOCONS':
            await this.pvsystPreloadRepository.pvsystCentrovet();
            await this.statsPreloadRepository.saveStats(
              'CENTROVET 255 AUTOCONS',
              centrovet255,
            );
            break;
          case 'CENTROVET 601':
            await this.pvsystPreloadRepository.pvsystCentrovet601();
            await this.statsPreloadRepository.saveStats(
              'CENTROVET 601',
              centrovet601,
            );
            break;
          case 'EKONO EL SALTO':
            await this.pvsystPreloadRepository.pvsystEnokoElSalto();
            await this.statsPreloadRepository.saveStats(
              'EKONO EL SALTO',
              ekonoelsalto,
            );
            break;
        }
      }
    }
  }

  async readExcel(buffer: Buffer) {
    try {
      const workbook: any = XLSX.read(buffer, { type: 'buffer', raw: true });
      const sheet: string = workbook.Sheets[workbook.SheetNames[0]];
      const dataExcel: string = XLSX.utils.sheet_to_json(sheet);
      if (dataExcel.length === 0) {
        throw new BadRequestException('Excel is empty');
      }
      return dataExcel;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw error;
    }
  }

  async extractDataIngecon(data: any): Promise<StatsDto[]> {
    try {
      if (data[0].GId) {
        console.log('la función llega hasta aqui');
        const extractedData = [];

        for (const stat of data) {
          let energy = stat['Energy(kWh)'];
          if (stat['Energy(kWh)'] === 'NaN') energy = '0';

          extractedData.push({
            day: stat['DateTime'].split(' ')[0].split('-')[2],
            month: stat['DateTime'].split(' ')[0].split('-')[1],
            year: stat['DateTime'].split(' ')[0].split('-')[0],
            energyGenerated: energy,
          });
        }
        return extractedData;
      } else {
        const extractedData = [];

        for (const stat of data) {
          extractedData.push({
            day: stat['dateTime'].split(' ')[0].split('-')[2],
            month: stat['dateTime'].split(' ')[0].split('-')[1],
            year: stat['dateTime'].split(' ')[0].split('-')[0],
            energyGenerated: stat['pvGeneration(kWh)'],
          });
        }

        return extractedData;
      }
    } catch (error) {
      throw error;
    }
  }

  /*async updatePanelStats(data: any, panelName: string) {
    try {
      console.log(panelName,"hola");// esta llegando undefined

      const newData = await this.extractDataIngecon(data);
      console.log(newData);

      const panel = await this.panelRepository.findOne({
        where: { name: panelName },
        relations: ['stats'],
      });
      console.log(panel);

      if (!panel) {
        throw new BadRequestException('Panel not found');
      }

      const allStats = await this.statsRepository.find({
        where: { panel: { id: panel.id } },
        relations: ['panel'],
      });

      const newStats = this.statsRepository.create(newData);

      for (const newStat of newStats) {
        let updated = false;
        for (const oldStat of allStats) {
          if (
            newStat.day == oldStat.day &&
            newStat.month == oldStat.month &&
            newStat.year == oldStat.year
          ) {
            await this.statsRepository.update(oldStat.id, {
              energyGenerated: newStat.energyGenerated,
            });
            
            updated = true;
            break;
          }
        }
        if (!updated) {
          this.statsRepository.save({
            ...newStat,
            panel: {
              id: panel.id,
            },
          });
        }
        console.log(newStat);
      }
      const updatedStats = await this.statsRepository.find({
        where: { panel: { id: panel.id } },
        relations: ['panel'],
      });

      panel.stats = updatedStats;
      this.panelRepository.save(panel);

      return newStats;
    } catch (error) {
      throw error;
    }
  }*/

  async updatePanelStats(data: any, panelName: string) {
    try {
      console.log(panelName, 'hola');

      const newData = await this.extractDataIngecon(data);
      console.log(newData);

      const panel = await this.panelRepository.findOne({
        where: { name: panelName },
        relations: ['stats'],
      });

      if (!panel) {
        throw new BadRequestException('Panel not found');
      }

      const allStats = await this.statsRepository.find({
        where: { panel: { id: panel.id } },
        relations: ['panel'],
      });

      for (const item of newData) {
        const stat = this.statsRepository.create(item);
        let updated = false;

        for (const oldStat of allStats) {
          if (
            stat.day == oldStat.day &&
            stat.month == oldStat.month &&
            stat.year == oldStat.year
          ) {
            await this.statsRepository.update(oldStat.id, {
              energyGenerated: stat.energyGenerated,
            });

            updated = true;
            break;
          }
        }
        if (!updated) {
          stat.panel = panel;
          await this.statsRepository.save(stat);
        }
      }

      const updatedStats = await this.statsRepository.find({
        where: { panel: { id: panel.id } },
      });

      panel.stats = updatedStats;

      await this.panelRepository.save(panel);

      return newData;
    } catch (error) {
      throw error;
    }
  }

  async getAllPanels(): Promise<Panel[]> {
    return await this.panelRepository.find();
  }

  async getPanelById(id: string): Promise<Panel> {
    const panel = await this.panelRepository.findOne({
      where: { id },
      relations: ['stats'],
    });

    if (panel && panel.stats) {
      panel.stats.sort((a, b) => {
        // Ordenar por año, mes y día ascendente
        if (a.year !== b.year) {
          return a.year - b.year;
        }
        if (a.month !== b.month) {
          return a.month - b.month;
        }
        return a.day - b.day;
      });
    }
    return panel;
  }

  async getDataForDashboard(name: string, month?: number, year?: number) {
    const panel = await this.panelRepository.findOne({
      where: { name },
      relations: ['stats', 'pvsyst'],
    });

    if (!panel) {
      throw new NotFoundException('Panel not found');
    }

    if (!year || !month) {
      const stats = panel.stats;
      if (stats.length === 0) {
        throw new NotFoundException('No statistics found');
      }

      year = Math.max(...stats.map((stat) => stat.year));
      const statsForYear = stats.filter((stat) => stat.year === year);
      month = Math.max(...statsForYear.map((stat) => stat.month));
    }

    const highestMonth = Math.max(
      ...panel.stats
        .filter((stat) => stat.year === year)
        .map((stat) => stat.month),
    );

    const filteredStatsCurrentYear = panel.stats.filter(
      (stat) => stat.year === year,
    );
    const filteredStatsPreviousYear = panel.stats.filter(
      (stat) => stat.year === year - 1,
    );

    const filteredPvsystCurrentYear = panel.pvsyst.filter(
      (pvsyst) => pvsyst.year === year,
    );
    const filteredPvsystPreviousYear = panel.pvsyst.filter(
      (pvsyst) => pvsyst.year === year - 1,
    );

    const dia_a_dia = filteredStatsCurrentYear
      .filter((stat) => stat.month === month)
      .map((stat) => ({
        dia: stat.day,
        energiaGenerada: stat.energyGenerated,
      }));

    const energiaAcumuladaPorMes = {};
    filteredStatsCurrentYear.forEach((stat) => {
      if (!energiaAcumuladaPorMes[stat.month]) {
        energiaAcumuladaPorMes[stat.month] = {
          energiaGeneradaAcumulada: 0,
          pvsyst: 0,
        };
      }
      energiaAcumuladaPorMes[stat.month].energiaGeneradaAcumulada +=
        stat.energyGenerated;
    });

    filteredPvsystCurrentYear.forEach((pvsyst) => {
      if (!energiaAcumuladaPorMes[pvsyst.month]) {
        energiaAcumuladaPorMes[pvsyst.month] = {
          energiaGeneradaAcumulada: 0,
          pvsyst: 0,
        };
      }
      energiaAcumuladaPorMes[pvsyst.month].pvsyst = pvsyst.estimatedGeneration;
    });

    const mes_a_mes = Array.from({ length: highestMonth }, (_, i) => i + 1)
      .map((monthIndex) => ({
        mes: monthIndex,
        energiaGeneradaAcumulada: parseFloat(
          (
            energiaAcumuladaPorMes[monthIndex]?.energiaGeneradaAcumulada || 0
          ).toFixed(1),
        ),
        pvsyst: energiaAcumuladaPorMes[monthIndex]?.pvsyst || 0,
      }))
      .filter(
        (entry) => entry.energiaGeneradaAcumulada > 0 || entry.pvsyst > 0,
      );

    let energiaGeneradaAnual = 0;
    let pvsystAnual = 0;

    filteredStatsCurrentYear
      .filter((stat) => stat.month <= highestMonth)
      .forEach((stat) => {
        energiaGeneradaAnual += stat.energyGenerated;
      });

    filteredPvsystCurrentYear
      .filter((pvsyst) => pvsyst.month <= highestMonth)
      .forEach((pvsyst) => {
        pvsystAnual += pvsyst.estimatedGeneration;
      });

    energiaGeneradaAnual = parseFloat(energiaGeneradaAnual.toFixed(1));
    pvsystAnual = parseFloat(pvsystAnual.toFixed(1));

    let energiaGeneradaAnualAnterior = 0;
    let pvsystAnualAnterior = 0;

    filteredStatsPreviousYear
      .filter((stat) => stat.month <= highestMonth)
      .forEach((stat) => {
        energiaGeneradaAnualAnterior += stat.energyGenerated;
      });

    filteredPvsystPreviousYear
      .filter((pvsyst) => pvsyst.month <= highestMonth)
      .forEach((pvsyst) => {
        pvsystAnualAnterior += pvsyst.estimatedGeneration;
      });

    energiaGeneradaAnualAnterior = parseFloat(
      energiaGeneradaAnualAnterior.toFixed(1),
    );
    pvsystAnualAnterior = parseFloat(pvsystAnualAnterior.toFixed(1));

    let energiaGeneradaMesAnterior = 0;
    let pvsystMesAnterior = 0;

    filteredStatsPreviousYear
      .filter((stat) => stat.month === month)
      .forEach((stat) => {
        energiaGeneradaMesAnterior += stat.energyGenerated;
      });

    filteredPvsystPreviousYear
      .filter((pvsyst) => pvsyst.month === month)
      .forEach((pvsyst) => {
        pvsystMesAnterior += pvsyst.estimatedGeneration;
      });

    energiaGeneradaMesAnterior = parseFloat(
      energiaGeneradaMesAnterior.toFixed(1),
    );
    pvsystMesAnterior = parseFloat(pvsystMesAnterior.toFixed(1));

    const dataMes = mes_a_mes.find((mes) => mes.mes === month);
    const mesVsPvsystActual = parseFloat(
      ((dataMes.energiaGeneradaAcumulada * 100) / dataMes.pvsyst).toFixed(1),
    );
    const mesVsGeneradaAnterior = parseFloat(
      (
        (dataMes.energiaGeneradaAcumulada * 100) /
        energiaGeneradaMesAnterior
      ).toFixed(1),
    );

    const añoVsPvsystActual = parseFloat(
      ((energiaGeneradaAnual * 100) / pvsystAnual).toFixed(1),
    );
    const añoVsGeneradaAnterior = parseFloat(
      ((energiaGeneradaAnual * 100) / energiaGeneradaAnualAnterior).toFixed(1),
    );

    return {
      dia_a_dia,
      mes_a_mes,
      energíaMesActual: dataMes.energiaGeneradaAcumulada,
      mesVsPvsystActual,
      mesVsGeneradaAnterior,
      energíaAnualActual: energiaGeneradaAnual,
      añoVsPvsystActual,
      añoVsGeneradaAnterior,
      inversor: panel.inversor,
      logo: panel.logo,
      address: panel.address,
    };
  }
}
