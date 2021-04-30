import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { TransformInterceptor } from 'src/common/response-transform.interceptor';
import { CartId } from 'src/decorators/cart-cookie.decorator';
import { ClientId } from 'src/decorators/client-id.decorator';
import { Cart } from 'src/schemas/cart.schema';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@UseInterceptors(TransformInterceptor)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async add(
    @Body() createCartDto: CreateCartDto,
    @Res({ passthrough: true }) response: Response,
    @CartId() cartId: string,
    @ClientId() clientId: string,
  ): Promise<Cart> {
    const data = await this.cartService.create(createCartDto, clientId, cartId);
    this.cartService.setCartInCookie(response, data._id);
    return data;
  }

  @Put()
  update(
    @Body() updateCartDto: UpdateCartDto,
    @CartId() cartId: string,
    @ClientId() clientId: string,
  ): Promise<Cart> {
    return this.cartService.update(updateCartDto, cartId, clientId);
  }

  @Get()
  find(@CartId() cartId: string): Promise<Cart> {
    return this.cartService.findById(cartId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Cart> {
    return this.cartService.findOne(id);
  }

  @Delete()
  async remove(
    @Body('itemId') id: string,
    @CartId() cartId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Cart> | null {
    const cart = await this.cartService.remove(cartId, id);
    if (!cart) {
      this.cartService.clearCookie(res);
    }
    return cart;
  }
}
