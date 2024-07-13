import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsPositive } from 'class-validator';

export class StatsDto {
  day: number;
  month: number;
  year: number;

  @ApiProperty({
    description: 'The photovoltaic generation in kilowatt-hours (kWh)',
    example: 350.75,
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  energyGenerated: number;
}
