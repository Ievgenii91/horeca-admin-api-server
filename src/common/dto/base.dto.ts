import { IsNotEmpty, IsMongoId } from 'class-validator';

export class BaseDto {
  @IsNotEmpty()
  @IsMongoId()
  clientId: string;
}
