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
    );
    const cartItem = new this.cartModel({
      lineItems: [product],
      createdAt: new Date().getUTCDate(),
      currency: {
        code: 'UAH',
      },
      id: new Date().getTime(),
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
}
