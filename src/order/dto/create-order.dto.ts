import { IsEmail, IsNotEmpty } from 'class-validator';
import { Product } from 'src/schemas/product.schema';

export enum RequestInitiator {
  Site = 'site',
  Bot = 'bot',
}

export class CreateOrderDto {
  @IsNotEmpty()
  clientId: string;

  @IsEmail()
  owner: string;

  @IsNotEmpty()
  initiator: RequestInitiator;

  phone: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  products: Partial<Product>[];

  room: string | number;

  userId: string | number;
}
