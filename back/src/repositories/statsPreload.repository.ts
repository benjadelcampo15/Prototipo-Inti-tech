import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Panel } from 'src/entities/panel.entity';
import { Stats } from 'src/entities/stats.entity';
import { bodegasSalcobrand } from 'src/utils/bodegasSalcobrand/bodegasSalcobrand';
import { Repository } from 'typeorm';

@Injectable()
export class statsPreloadRepository {
  constructor(
    @InjectRepository(Stats)
    private readonly statsRepository: Repository<Stats>,
    @InjectRepository(Panel)
    private readonly panelRepository: Repository<Panel>,
  ) {}

  async statsBodegasSalcobrand() {
    const panel = await this.panelRepository.findOne({
      where: { name: 'BODEGAS SALCOBRAND' },
    });
    for (const stats of bodegasSalcobrand) {
      const newStats = this.statsRepository.create({
        day: stats.day,
        month: stats.month,
        year: stats.year,
        energyGenerated: stats.energyGenerated,
        panel: panel,
      });
      await this.statsRepository.save(newStats);
    }
  }

  async stats() {
    const panel = await this.panelRepository.findOne({
      where: { name: 'BODEGAS SALCOBRAND' },
    });
    for (const stats of bodegasSalcobrand) {
      const newStats = this.statsRepository.create({
        day: stats.day,
        month: stats.month,
        year: stats.year,
        energyGenerated: stats.energyGenerated,
        panel: panel,
      });
      await this.statsRepository.save(newStats);
    }
  }
}
