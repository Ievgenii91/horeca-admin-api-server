import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TimeTrackingDocument = TimeTracking & Document;

@Schema()
export class TimeTracking {
  @Prop({ required: true, type: String })
  employeeName: string;

  @Prop({ required: true, type: String })
  employeeId: string;

  @Prop({ required: true })
  startDate: string;

  @Prop({ required: true })
  endDate: string;
}

export const TimeTrackingSchema = SchemaFactory.createForClass(TimeTracking);
