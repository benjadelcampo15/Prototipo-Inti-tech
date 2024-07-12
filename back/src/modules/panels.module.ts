import { Module } from "@nestjs/common";
import { PanelsController } from "src/controllers/panels.controller";
import { PanelRepository } from "src/repositories/panel.repository";

@Module({
    imports:[],
    controllers: [PanelsController],
    providers: [PanelRepository ],
    exports: [],
})

export class PanelsModule {}