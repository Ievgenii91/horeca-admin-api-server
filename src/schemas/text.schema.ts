import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TextDocument = Text & Document;

@Schema()
export class Text {}

export const TextSchema = SchemaFactory.createForClass(Text);
