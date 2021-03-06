import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export interface Ref {
  id: number | string;
  hasUnusedBonus: boolean;
  active: boolean;
}

@Schema()
export class User {
  @Prop()
  id: number;

  @Prop()
  isBot: boolean;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  username: string;

  @Prop()
  orders: Array<string>;

  @Prop()
  appJoins: number;

  @Prop()
  bonusCount: number;

  @Prop()
  refs: Array<Ref>;

  @Prop()
  phone: string;

  @Prop()
  hasUnusedInvitationBonus: boolean;

  @Prop()
  invitedBy: string;

  @Prop()
  email: string;

  @Prop()
  role: string;

  @Prop()
  hourRate: number;

  constructor(data: Partial<User>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
