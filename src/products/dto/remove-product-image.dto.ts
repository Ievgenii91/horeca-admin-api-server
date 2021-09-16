import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RemoveProductImageDto {
  @IsNotEmpty()
  @ApiProperty()
  clientId: string;
  @IsNotEmpty()
  @ApiProperty()
  id: string;
}

export class RemoveProductDto extends RemoveProductImageDto {}
