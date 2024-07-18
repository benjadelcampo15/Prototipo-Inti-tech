import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
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
    for (const planta of plantas) {
      console.log(planta);
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
}
