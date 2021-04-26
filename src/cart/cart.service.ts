import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from 'src/schemas/cart.schema';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ProductService } from './../product/product.service';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    private productService: ProductService,
  ) {}

  async create(createCartDto: CreateCartDto): Promise<CartDocument> {
    const product = await this.productService.getProduct(
      createCartDto.productId,
      createCartDto.clientId,
      'id',
    );
    const cartItem = new this.cartModel({
      lineItems: [product],
      createdAt: new Date().toISOString(),
      currency: {
        code: 'UAH',
      },
    });
    cartItem.save();
    return cartItem;
  }

  findAll(id: string) {
    return this.cartModel.findOne({ id }).exec();
  }

  findOne(id: string) {
    return this.cartModel.findOne({ id }).exec();
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: string) {
    return this.cartModel.deleteOne({ id }).exec();
  }

  getCookieExpirationDate() {
    const date = new Date();
    if (date.getMonth() === 12) {
      date.setMonth(1);
      date.setFullYear(date.getFullYear() + 1);
    } else {
      date.setMonth(date.getMonth() + 1);
    }
    return date; //.toISOString();
  }

  setCartInCookie(response, cart) {
    const expires = this.getCookieExpirationDate();
    response.cookie('bc_cartId', decodeURI(cart._id), {
      httpOnly: false,
      sameSite: 'None',
      secure: true,
      expires: expires,
    });
  }
}
