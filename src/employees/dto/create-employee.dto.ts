import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDto {
  @IsNotEmpty()
  @ApiProperty()
  clientId: string;
  @IsNotEmpty()
  @ApiProperty()
  name: string;
  @IsNotEmpty()
  @ApiProperty()
  password: string;
  @ApiProperty()
  ratePerHour: number;
  @ApiProperty()
  started: string;
  @ApiProperty()
  position: string;
  @ApiProperty()
  prevRates: Array<any>;
}
