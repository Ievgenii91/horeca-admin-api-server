import { IsNotEmpty } from 'class-validator';
import { Product } from 'src/schemas/product.schema';

export class CreateProductDto extends Product {
  @IsNotEmpty()
  clientId: string;
  constructor(data: Partial<Product>) {
    super(data);
  }
}
