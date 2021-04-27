import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Headers,
  Put,
} from '@nestjs/common';
import { CartId } from 'src/decorators/cart-cookie.decorator';
import { Cart } from 'src/schemas/cart.schema';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async add(
    @Body() createCartDto: CreateCartDto,
    @Res({ passthrough: true }) response,
    @CartId() cartId: string,
    @Headers('X-Auth-Client') clientId: string,
  ): Promise<{ data: Cart }> {
    if (!createCartDto.clientId) {
      createCartDto.clientId = clientId;
    }

    const data = await this.cartService.create(createCartDto, cartId);
    this.cartService.setCartInCookie(response, data);
    return { data };
  }

  @Put()
  async update(
    @Body() updateCartDto: UpdateCartDto,
    @CartId() cartId: string,
    @Headers('X-Auth-Client') clientId: string,
  ) {
    const data = await this.cartService.update(updateCartDto, cartId, clientId);
    return {
      data,
    };
  }

  @Get()
  async find(@CartId() cartId: string) {
    const cart = await this.cartService.findById(cartId);
    return {
      data: cart,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(id);
  }

  @Delete()
  remove(@Body('itemId') id: string, @CartId() cartId: string) {
    return this.cartService.remove(cartId, id);
  }
}
