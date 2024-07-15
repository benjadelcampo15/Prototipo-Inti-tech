import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatsDto } from 'src/dtos/stats.dto';
import { Repository } from 'typeorm';
import { Panel } from 'src/entities/panel.entity';
import { pvsystPreloadRepository } from './pvsystPreload.repository';
import { statsPreloadRepository } from './statsPreload.repository';
import { listaDePlantas } from 'src/utils/listaDePlantas';

const XLSX = require('xlsx');

@Injectable()
export class PanelRepository implements OnModuleInit {
  constructor(
    private readonly pvsystPreloadRepository: pvsystPreloadRepository,
    private readonly statsPreloadRepository: statsPreloadRepository,
    @InjectRepository(Panel)
    private readonly panelRepository: Repository<Panel>,
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
}
