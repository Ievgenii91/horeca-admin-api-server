import { Product } from 'src/schemas/product.schema';

export class UpdateProductDto extends Product {
  clientId: string;
  constructor(data: Partial<Product>) {
    super(data);
  }
}
