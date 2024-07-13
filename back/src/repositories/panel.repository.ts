import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatsDto } from 'src/dtos/stats.dto';
import { Stats } from 'src/entities/stats.entity';
import { Repository } from 'typeorm';
import { bodegasSalcobrand } from 'src/utils/bodegasSalcobrand/bodegasSalcobrand';
import { plantas } from 'src/utils/plantas/plantas';
import { Panel } from 'src/entities/panel.entity';
import { Pvsyst } from 'src/entities/pvsyst.entity';
import { pvsystPreloadRepository } from './pvsystPreload.repository';
import { statsPreloadRepository } from './statsPreload.repository';
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
    const panel = await this.panelRepository.find();
    if (panel.length > 0) return;

    for (const panel of plantas) {
      const newPanel = this.panelRepository.create({
        name: panel.name,
        inversor: panel.inversor,
      });
      await this.panelRepository.save(newPanel);

      switch (panel.inversor) {
        case 'INGECON':
          await this.pvsystPreloadRepository.pvsystBodegasSalcobrand();
          await this.statsPreloadRepository.statsBodegasSalcobrand();
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
