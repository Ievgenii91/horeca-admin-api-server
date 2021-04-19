import { Controller, Get, Post } from '@nestjs/common';

@Controller('wishlist')
export class WishlistController {
  @Post()
  addToWidhList() {
    return [];
  }

  @Get()
  getWishlist() {
    return [];
  }
}
