import { IsNotEmpty } from 'class-validator';
import { BaseDto } from 'src/common/dto/base.dto';

export class DeleteProductDto extends BaseDto {
  @IsNotEmpty()
  id: string;
  constructor() {
    super();
  }
}
