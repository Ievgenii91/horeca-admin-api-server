import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ImageDocument = Image & Document;

@Schema()
export class Image {
  @Prop()
  alt: string;
  @Prop()
  url: string;
  @Prop()
  key: string;
  @Prop()
  isDefault: boolean;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
