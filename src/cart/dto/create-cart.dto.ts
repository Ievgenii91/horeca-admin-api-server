import { IsNotEmpty } from 'class-validator';

export class CreateCartDto {
  @IsNotEmpty()
  productId: string;
  @IsNotEmpty()
  clientId: string;
  variableId: string;
}
