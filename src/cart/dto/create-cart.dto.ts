import { IsNotEmpty } from 'class-validator';

export class CreateCartDto {
  @IsNotEmpty()
  productId: string;
  clientId: string;
  variableId: string;
  requiresShipping: boolean;
}
