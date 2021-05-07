import {
  IsNotEmpty,
  IsPhoneNumber,
  IsDateString,
  IsNumber,
  IsOptional,
  IsEmail,
} from 'class-validator';
import { Product } from 'src/schemas/product.schema';

export enum RequestInitiator {
  Site = 'site',
  Bot = 'bot',
}

export class CreateOrderDto {
  @IsNotEmpty()
  @IsOptional()
  clientId: string;

  @IsNotEmpty()
  initiator: RequestInitiator;

  @IsOptional()
  @IsEmail()
  owner: string;

  @IsPhoneNumber('UA')
  @IsOptional()
  phone: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  products: Partial<Product>[];

  @IsDateString()
  date: string;

  room: string | number;

  userId: string | number;

  @IsOptional()
  address: string;

  @IsNumber()
  @IsOptional()
  deliverPrice: number;

  @IsNumber()
  @IsOptional()
  packagingPrice: number;
}
