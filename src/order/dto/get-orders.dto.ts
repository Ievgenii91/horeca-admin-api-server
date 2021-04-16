import { IsNotEmpty } from 'class-validator';
import { BaseDto } from 'src/common/dto/base.dto';

export class GetOrdersDto extends BaseDto {
  @IsNotEmpty()
  status: string;
}
