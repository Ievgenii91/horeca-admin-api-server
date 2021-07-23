import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from '../products/products.module';
import { Cart, CartSchema } from 'src/schemas/cart.schema';
import { Product, ProductSchema } from 'src/schemas/product.schema';

@Module({
  imports: [
    ProductModule,
    MongooseModule.forFeature([
      {
        name: Cart.name,
        schema: CartSchema,
      },
      {
        name: Product.name,
        schema: ProductSchema,
      },
    ]),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
