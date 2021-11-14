import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTimetrackingDto {
  @IsNotEmpty()
  @ApiProperty()
  employeeName: string;

  @IsNotEmpty()
  @ApiProperty()
  employeeId: string;

  @IsNotEmpty()
  @ApiProperty()
  startDate: string;

  @IsNotEmpty()
  @ApiProperty()
  endDate: string;
}
