import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTimetrackingDto {
  @IsNotEmpty()
  @ApiProperty()
  clientId: string;

  @IsNotEmpty()
  @ApiProperty()
  employeeName: string;

  @IsNotEmpty()
  @ApiProperty()
  employeeId: string;

  @IsNotEmpty()
  @ApiProperty()
  startDate: Date;

  @IsNotEmpty()
  @ApiProperty()
  endDate: Date;

  @IsNotEmpty()
  @ApiProperty()
  ratePerHour: number;
}
