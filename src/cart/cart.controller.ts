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
  ): Promise<Cart> {
    const cart = await this.cartService.create(createCartDto);
    console.log(cart.id, cart.get('_id'), '@@@');
    response.cookie('bc_cartId', cart.get('_id'));
    return cart;
  }

  @Get()
  find(@Req() request) {
    const cartId = request.cookies['bc_cartId'];
    return this.cartService.findAll(cartId);
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
