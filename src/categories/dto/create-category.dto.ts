import { IsNotEmpty, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateCategoryDto {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  clientId: string;
  @ApiProperty({
    type: String,
    description: 'category image url',
  })
  @IsUrl()
  @IsOptional()
  imageUrl: string;
  // _id on front
  entityId: number;
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  path: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  productCount: number;
  @ApiProperty()
  children: Array<CreateCategoryDto>;
}
