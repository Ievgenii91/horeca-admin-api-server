import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Client } from 'src/schemas/client.schema';

export type CategoryDocument = Category & Document;

@Schema()
export class Category {
  @Prop({ type: String, ref: Client })
  clientId: string;
  @Prop()
  imageUrl: string;
  @Prop()
  entityId: number;
  @Prop()
  name: string;
  @Prop()
  path: string;
  @Prop()
  description: string;
  @Prop()
  productCount: number;
  @Prop()
  children: Array<Category>;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
