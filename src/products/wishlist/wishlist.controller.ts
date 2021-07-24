import { Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { TransformInterceptor } from 'src/common/response-transform.interceptor';

@UseInterceptors(TransformInterceptor)
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
