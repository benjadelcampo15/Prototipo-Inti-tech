import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Panel } from 'src/entities/panel.entity';
import { Pvsyst } from 'src/entities/pvsyst.entity';
import { pvsystBS } from 'src/utils/pvsyst';
import { pvsystCentrovet } from 'src/utils/pvsyst';
import { Repository } from 'typeorm';

@Injectable()
export class pvsystPreloadRepository {
  constructor(
    @InjectRepository(Pvsyst)
    private readonly pvsystRepository: Repository<Pvsyst>,
    @InjectRepository(Panel)
    private readonly panelRepository: Repository<Panel>,
  ) {}

  async pvsystBodegasSalcobrand() {
    const panel = await this.panelRepository.findOne({
      where: { name: 'BODEGAS SALCOBRAND' },
    });
    if (!panel) {
      throw new Error('Panel not found');
    }

    for (const pvsyst of pvsystBS) {
      const newPvsyst = this.pvsystRepository.create({
        month: pvsyst.month,
        year: pvsyst.year,
        estimatedGeneration: pvsyst.estimatedGeneration,
        panel: panel,
      });
      await this.pvsystRepository.save(newPvsyst);
    }
  }

  async pvsystCentrovet() {
    const panel = await this.panelRepository.findOne({
      where: { name: 'CENTROVET 255 AUTOCONS' },
    });
    if (!panel) {
      throw new Error('Panel not found');
    }

    for (const pvsyst of pvsystCentrovet) {
      const newPvsyst = this.pvsystRepository.create({
        month: pvsyst.month,
        year: pvsyst.year,
        estimatedGeneration: pvsyst.estimatedGeneration,
        panel: panel,
      });
      await this.pvsystRepository.save(newPvsyst);
    }
  }
}
