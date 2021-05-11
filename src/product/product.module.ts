import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/schemas/product.schema';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
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
  providers: [ProductService],
  controllers: [ProductController, WishlistController],
  exports: [ProductService],
})
export class ProductModule {}
