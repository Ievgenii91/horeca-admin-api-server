import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TimeTrackingDocument = TimeTracking & Document;

@Schema()
export class TimeTracking {
  @Prop({ required: true, type: String })
  clientId: string;

  @Prop({ type: String })
  employeeName: string;

  @Prop({ required: true, type: String })
  employeeId: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true })
  ratePerHour: number;
}

export const TimeTrackingSchema = SchemaFactory.createForClass(TimeTracking);
