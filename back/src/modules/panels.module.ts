import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stats } from 'src/entities/stats.entity';
import { PanelsController } from 'src/controllers/panels.controller';
import { Panel } from 'src/entities/panel.entity';
import { Pvsyst } from 'src/entities/pvsyst.entity';
import { PanelRepository } from 'src/repositories/panel.repository';
import { pvsystPreloadRepository } from 'src/repositories/pvsystPreload.repository';
import { statsPreloadRepository } from 'src/repositories/statsPreload.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Panel, Stats, Pvsyst])],
  controllers: [PanelsController],
  providers: [PanelRepository, pvsystPreloadRepository, statsPreloadRepository],
  exports: [],
})
export class PanelsModule {}
