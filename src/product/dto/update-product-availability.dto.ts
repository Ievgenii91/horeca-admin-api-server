import { IsBoolean, IsNotEmpty } from 'class-validator';
import { BaseDto } from './../../common/dto/base.dto';

export class UpdateProductAvailabilityDto extends BaseDto {
  @IsNotEmpty()
  @IsBoolean()
  available: boolean;
  @IsNotEmpty()
  id: string;

  constructor() {
    super();
  }
}
