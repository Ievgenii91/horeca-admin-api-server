import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmployeeDocument = Employee & Document;

@Schema()
export class Employee {
  @Prop({ required: true, type: String })
  clientId: string;

  @Prop({ required: true, type: String })
  name: string;

  @Prop()
  ratePerHour: number;

  @Prop({ required: true })
  password: string;

  @Prop()
  started: string;

  @Prop()
  position: string;

  @Prop({ type: Array })
  prevRates: Array<any>;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
