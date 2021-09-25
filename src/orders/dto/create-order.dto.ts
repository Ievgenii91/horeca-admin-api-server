import {
  IsNotEmpty,
  Matches,
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

  @Matches(/^\+[0-9]{2}\((0\d+)\)\s\d{3}\s\d{2}\s\d{2}/)
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
