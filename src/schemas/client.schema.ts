import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ProductSchema, Product } from './product.schema';

export type ClientDocument = Client & Document;

@Schema()
export class Client {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true })
  owner: string;

  @Prop({ type: [ProductSchema], required: true })
  products: Product[];

  @Prop()
  ordersCount: number;

  @Prop()
  botName: string;

  @Prop()
  botToken: string;

  @Prop()
  paymentToken: string;

  @Prop()
  oncomingChatId: string;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
