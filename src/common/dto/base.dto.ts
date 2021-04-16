import { IsNotEmpty } from 'class-validator';

export class BaseDto {
  @IsNotEmpty()
  clientId: string;
}
