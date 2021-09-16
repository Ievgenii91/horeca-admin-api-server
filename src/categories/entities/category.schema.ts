import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema()
export class Category {
  @Prop({ type: String })
  clientId: string;
  @Prop()
  imageUrl: string;
  @Prop()
  name: string;
  @Prop()
  path: string;
  @Prop()
  description: string;
  @Prop()
  productCount: number;
  @Prop()
  order: number;
  @Prop()
  children: Array<Category>;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
