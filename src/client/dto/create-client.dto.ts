import { IsEmail, MaxLength, MinLength } from 'class-validator';
import { Product } from 'src/schemas/product.schema';

export class CreateClientDto {
  @MinLength(2)
  @MaxLength(140)
  name: string;

  @IsEmail()
  owner: string;

  products: Partial<Product>[];
}
