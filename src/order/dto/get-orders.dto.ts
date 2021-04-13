import { IsNotEmpty } from 'class-validator';

export class GetOrdersDto {
  @IsNotEmpty()
  clientId: string;

  @IsNotEmpty()
  status: string;
}
