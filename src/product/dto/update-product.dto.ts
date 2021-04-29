import { IsNotEmpty } from 'class-validator';
import { Product } from 'src/schemas/product.schema';

export class UpdateProductDto extends Product {
  @IsNotEmpty()
  clientId: string;
  constructor(data: Partial<Product>) {
    super(data);
  }
}
