import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Panel } from 'src/entities/panel.entity';
import { PanelRepository } from 'src/repositories/panel.repository';

@Controller('panels')
export class PanelsController {
  constructor(private panelRepository: PanelRepository) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body('panelName') panelName: string) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    try {
      const data = await this.panelRepository.readExcel(file.buffer);
      // console.log(data);

      return await this.panelRepository.updatePanelStats(data , panelName);
      
    } catch (error) {
      return { error: `Failed to process file: ${error.message}` };
    }
  }
  
  @Get()
  async getAllPanels(): Promise<Panel[]> {
    return await this.panelRepository.getAllPanels();
  }

  @Get(':id')
  async getPanelById(@Param('id') id: string): Promise<Panel> {
    return await this.panelRepository.getPanelById(id);
  }
}
