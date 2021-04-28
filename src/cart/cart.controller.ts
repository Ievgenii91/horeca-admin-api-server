import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  Headers,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { TransformInterceptor } from 'src/common/response-transform.interceptor';
import { CartId } from 'src/decorators/cart-cookie.decorator';
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
    @Res({ passthrough: true }) response,
    @CartId() cartId: string,
    @Headers('X-Auth-Client') clientId: string,
  ): Promise<Cart> {
    if (!createCartDto.clientId) {
      createCartDto.clientId = clientId;
    }

    const data = await this.cartService.create(createCartDto, cartId);
    this.cartService.setCartInCookie(response, data);
    return data;
  }

  @Put()
  update(
    @Body() updateCartDto: UpdateCartDto,
    @CartId() cartId: string,
    @Headers('X-Auth-Client') clientId: string,
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
  remove(@Body('itemId') id: string, @CartId() cartId: string) {
    return this.cartService.remove(cartId, id);
  }
}
