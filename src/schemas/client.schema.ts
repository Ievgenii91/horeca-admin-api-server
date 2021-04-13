import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ProductSchema, ProductDocument } from './product.schema';

export type ClientDocument = Client & Document;

@Schema()
export class Client {
  @Prop()
  _id: string;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true })
  owner: string;

  @Prop({ type: [ProductSchema], required: true })
  products: ProductDocument[];

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
