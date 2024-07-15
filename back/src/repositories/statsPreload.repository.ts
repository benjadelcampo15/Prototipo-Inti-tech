import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatsDto } from 'src/dtos/stats.dto';
import { Panel } from 'src/entities/panel.entity';
import { Stats } from 'src/entities/stats.entity';
import { bodegasSalcobrand } from 'src/utils/bodegasSalcobrand/bodegasSalcobrand';
import { Repository } from 'typeorm';
import { centrovet255 } from 'src/utils/centrovet255/centrovet';

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

/*async stats() {
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
}*/

async saveStats(plantName: string, statsData: StatsDto[]) {
  const panel = await this.panelRepository.findOne({
    where: { name: plantName },
  });

  if (!panel) {
    throw new Error(`Panel with name ${plantName} not found`);
  }

  for (const stats of statsData) {
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


async saveStatsForBodegasSalcobrand() {
  
   
  await this.saveStats('BODEGAS SALCOBRAND', bodegasSalcobrand);
}

// Ejemplo de uso de la función genérica para otra planta
async saveStatsForCentrovet() {
 
  await this.saveStats('Centrovet255', centrovet255);
}


}
