type Item = {
  quantity: number;
  productId: string;
  variantId: string;
};
export class UpdateCartDto {
  itemId: string;
  item: Item;
}
