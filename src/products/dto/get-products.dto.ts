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
  brand: string; // TODO remove
  @ApiProperty()
  sort: string;
  @ApiProperty()
  q: string;
  @ApiProperty()
  tag: string;
}
