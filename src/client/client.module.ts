import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { Client, ClientSchema } from './../schemas/client.schema';
import { Product, ProductSchema } from 'src/schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Client.name,
        schema: ClientSchema,
      },
      {
        name: Product.name,
        schema: ProductSchema,
      },
    ]),
  ],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService],
})
export class ClientModule {}
