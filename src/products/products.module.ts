import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/schemas/product.schema';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { WishlistController } from './wishlist/wishlist.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
      },
    ]),
  ],
  providers: [ProductsService],
  controllers: [ProductsController, WishlistController],
  exports: [ProductsService],
})
export class ProductsModule {}
