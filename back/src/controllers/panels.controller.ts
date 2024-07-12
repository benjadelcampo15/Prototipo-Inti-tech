import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StatsDto } from 'src/dtos/stats.dto';
import { PanelRepository } from 'src/repositories/panel.repository';

@Controller('panels')
export class PanelsController {
  constructor(private panelRepository: PanelRepository) {}
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    try {
      const data = await this.panelRepository.readExcel(file.buffer);
      // console.log(data);
      
      return await this.panelRepository.extractDataIngecon(data);
    } catch (error) {
      return { error: `Failed to process file: ${error.message}` };
    }
  }
}
