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
  @ApiProperty({
    type: Number,
  })
  entityId: number;
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  name: string;
  @ApiProperty({
    type: String,
  })
  path: string;
  @ApiProperty({
    type: String,
  })
  description: string;
  @ApiProperty({
    type: String,
  })
  classes: string;
  @ApiProperty({
    type: String,
  })
  productCount: number;
  @ApiProperty({
    type: Number,
  })
  order: number;
  @ApiProperty()
  children: any[]; // TODO: string type, but build throws strange exception
}
