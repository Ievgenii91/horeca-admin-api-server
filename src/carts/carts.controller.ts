import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { TransformInterceptor } from 'src/common/response-transform.interceptor';
import { CartId } from 'src/decorators/cart-cookie.decorator';
import { ClientId } from 'src/decorators/client-id.decorator';
import { Cart } from 'src/schemas/cart.schema';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@UseInterceptors(TransformInterceptor)
@Controller('v1/cart')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  async add(
    @Body() createCartDto: CreateCartDto,
    @CartId() cartId: string,
    @ClientId() clientId: string,
  ): Promise<Cart> {
    return this.cartsService.create(createCartDto, clientId, cartId);
  }

  @Put()
  update(
    @Body() updateCartDto: UpdateCartDto,
    @CartId() cartId: string,
    @ClientId() clientId: string,
  ): Promise<Cart> {
    return this.cartsService.update(updateCartDto, cartId, clientId);
  }

  @Get()
  find(@CartId() cartId: string): Promise<Cart> {
    return this.cartsService.findById(cartId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Cart> {
    return this.cartsService.findOne(id);
  }

  @Delete()
  async remove(
    @Body('itemId') id: string,
    @CartId() cartId: string,
  ): Promise<Cart> | null {
    return this.cartsService.remove(cartId, id);
  }
}
