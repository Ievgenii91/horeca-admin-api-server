import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

export class GetVisitsDto {
  @IsOptional()
  @IsDateString()
  startDate: Date;

  @IsOptional()
  @IsDateString()
  endDate: Date;

  @IsNotEmpty()
  clientId: string;

  @IsOptional()
  zone: string;

  @IsOptional()
  agent: string;

  @IsOptional()
  ip: string;
}
