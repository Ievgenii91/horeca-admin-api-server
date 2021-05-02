import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';
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

  @IsPhoneNumber('UA')
  phone: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  products: Partial<Product>[];

  room: string | number;

  userId: string | number;
}
