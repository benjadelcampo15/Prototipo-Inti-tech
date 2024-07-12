import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsPositive } from 'class-validator';

export class StatsDto {
  
  date: Date;

  @ApiProperty({
    description: 'The photovoltaic generation in kilowatt-hours (kWh)',
    example: 350.75,
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  pvGeneration: number;
}