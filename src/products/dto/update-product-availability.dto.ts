import { IsBoolean, IsNotEmpty } from 'class-validator';
import { BaseDto } from '../../common/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateProductAvailabilityDto extends BaseDto {
  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  available: boolean;
  @IsNotEmpty()
  @ApiProperty()
  id: string;

  constructor() {
    super();
  }
}
