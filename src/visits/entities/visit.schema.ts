import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VisitDocument = Visit & Document;

@Schema()
export class Visit {
  @Prop({ type: String })
  clientId: string;
  @Prop({ type: String })
  zone: string;
  date: Date;
  @Prop({ type: String })
  agent: string;
  @Prop({ type: String })
  ip: string;
}

export const VisitSchema = SchemaFactory.createForClass(Visit);
