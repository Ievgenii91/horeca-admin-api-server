export class GetProductsDto {
  clientId: string;
  category: string;
  search: string;
  brand: string; // TODO remove
  sort: string;
  q: string;
  tag: string;
}
