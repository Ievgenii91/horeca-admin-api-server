import { IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  clientId: string;
  @IsUrl()
  @IsOptional()
  imageUrl: string;
  // _id on front
  entityId: number;

  @IsNotEmpty()
  name: string;

  path: string;

  description: string;

  productCount: number;

  children: Array<CreateCategoryDto>;
}
