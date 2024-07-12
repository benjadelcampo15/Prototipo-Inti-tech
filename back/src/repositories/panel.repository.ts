import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatsDto } from 'src/dtos/stats.dto';
import { Stats } from 'src/entities/stats.entity';
import { Repository } from 'typeorm';
const XLSX = require('xlsx');
@Injectable()
export class PanelRepository {
  constructor() {}
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
