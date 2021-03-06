import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ProductSchema, ProductDocument } from './product.schema';

export type OrderDocument = Order & Document;

@Schema()
export class Order {
  @Prop()
  id: string;

  @Prop()
  type: string;

  @Prop({ type: [ProductSchema], required: true })
  products: ProductDocument[];

  @Prop()
  date: Date;

  @Prop()
  initiator: string;

  @Prop()
  status: string;

  @Prop()
  room: string;

  @Prop()
  waiter: string;

  @Prop()
  clientId: string;

  @Prop()
  userId: string;

  @Prop()
  address: string;

  @Prop()
  deliverPrice: number;

  @Prop()
  packagingPrice: number;

  hasBonus() {
    return this.products.filter((v) => v.bonus).length > 0;
  }
}

export const OrderSchema = SchemaFactory.createForClass(Order);
