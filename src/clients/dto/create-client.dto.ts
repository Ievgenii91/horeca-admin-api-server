import { IsEmail, MaxLength, MinLength } from 'class-validator';
import { Product } from 'src/schemas/product.schema';
import { ApiProperty } from '@nestjs/swagger';
export class CreateClientDto {
  @ApiProperty({
    type: String,
  })
  @MinLength(2)
  @MaxLength(140)
  name: string;

  @IsEmail()
  owner: string;

  products: Partial<Product>[];
}
