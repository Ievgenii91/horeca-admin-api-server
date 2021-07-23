import { IsNotEmpty } from 'class-validator';
import { Product } from 'src/schemas/product.schema';
import { ApiProperty } from '@nestjs/swagger';
export class CreateProductDto extends Product {
  @ApiProperty()
  @IsNotEmpty()
  clientId: string;
  constructor(data: Partial<Product>) {
    super(data);
  }
}
