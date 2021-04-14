import { IsNotEmpty } from 'class-validator';

export class GetProductsDto {
  @IsNotEmpty()
  clientId: string;
}
