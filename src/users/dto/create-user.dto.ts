import { IsNotEmpty, IsEmail } from 'class-validator';
import { Ref } from 'src/schemas/user.schema';

export enum RequestInitiator {
  Site = 'site',
  Bot = 'bot',
}

interface Role {
  name: string;
  id: string;
}

export class CreateUserDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  isBot: boolean;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  orders: Array<string>;

  @IsNotEmpty()
  appJoins: number;

  @IsNotEmpty()
  bonusCount: number;

  @IsNotEmpty()
  refs: Array<Ref>;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  hasUnusedInvitationBonus: boolean;

  @IsNotEmpty()
  invitedBy: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  role: Role;

  @IsNotEmpty()
  hourRate: number;
}
