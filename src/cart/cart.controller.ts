import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
  Headers,
} from '@nestjs/common';
import { Cart } from 'src/schemas/cart.schema';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async create(
    @Body() createCartDto: CreateCartDto,
    @Res({ passthrough: true }) response,
    @Headers('X-Auth-Client') clientId: string,
  ): Promise<Cart> {
    if (!createCartDto.clientId) {
      createCartDto.clientId = clientId;
    }
    const cart = await this.cartService.create(createCartDto);
    this.cartService.setCartInCookie(response, cart);
    return cart;
  }

  @Get()
  async find(@Req() request) {
    const cartId = request.cookies['bc_cartId'];
    const cart = await this.cartService.findAll(cartId);
    return {
      data: cart,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(+id, updateCartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(id);
  }
}
