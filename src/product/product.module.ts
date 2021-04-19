import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ClientModule } from './../client/client.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Client, ClientSchema } from 'src/schemas/client.schema';
import { WishlistController } from './wishlist/wishlist.controller';

@Module({
  imports: [
    ClientModule,
    MongooseModule.forFeature([
      {
        name: Client.name,
        schema: ClientSchema,
      },
    ]),
  ],
  providers: [ProductService],
  controllers: [ProductController, WishlistController],
})
export class ProductModule {}
