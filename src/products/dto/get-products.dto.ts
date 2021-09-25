import { ApiProperty } from '@nestjs/swagger';
export class GetProductsDto {
  @ApiProperty({
    description: 'unique client id to check what app is used',
  })
  clientId: string;
  @ApiProperty()
  category: string;
  @ApiProperty()
  search: string;
  @ApiProperty()
  type: string;
  @ApiProperty()
  tags: string;
  @ApiProperty()
  rating: string;
  @ApiProperty()
  limit?: number;
}
