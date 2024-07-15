import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatsDto } from 'src/dtos/stats.dto';
import { Repository } from 'typeorm';
import { Panel } from 'src/entities/panel.entity';
import { pvsystPreloadRepository } from './pvsystPreload.repository';
import { statsPreloadRepository } from './statsPreload.repository';
import { listaDePlantas } from 'src/utils/listaDePlantas';
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
    for (const planta of listaDePlantas) {
      const panel = await this.panelRepository.findOne({
        where: { name: planta.name },
      });

      if (!panel) {
        const newPanel = this.panelRepository.create({
          name: planta.name,
          inversor: planta.inversor,
        });

        await this.panelRepository.save(newPanel);

        switch (newPanel.name) {
          case 'BODEGAS SALCOBRAND':
            await this.pvsystPreloadRepository.pvsystBodegasSalcobrand();
            await this.statsPreloadRepository.saveStatsForBodegasSalcobrand();
            break;
          case 'CENTROVET 255 AUTOCONS':
            await this.pvsystPreloadRepository.pvsystCentrovet();
            await this.statsPreloadRepository.saveStatsForCentrovet();
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
    } catch (error) {
      throw error;
    }
  }

  async updatePanelStats(data: any, panelName: string) {
    try {
      console.log(panelName);

      const newData = await this.extractDataIngecon(data);

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
}
