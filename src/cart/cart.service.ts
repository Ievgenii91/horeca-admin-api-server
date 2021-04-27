import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument, LineItem } from 'src/schemas/cart.schema';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ProductService } from './../product/product.service';
import { Product } from 'src/schemas/product.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    private productService: ProductService,
  ) {}

  private productToCartLineItem(product: Product): LineItem {
    return {
      id: product.id,
      variantId: product['_id'],
      productId: product['_id'],
      name: product.name,
      quantity: product.count,
      discounts: [],
      // A human-friendly unique string automatically generated from the product’s name
      path: product.slug,
      variant: {
        id: product['_id'],
        sku: product.id,
        name: product.name,
        requiresShipping: false,
        price: product.price,
        listPrice: product.price,
      },
    };
  }

  async create(
    createCartDto: CreateCartDto,
    cartId: string,
  ): Promise<CartDocument> {
    const product = await this.productService.getProduct(
      createCartDto.productId,
      createCartDto.clientId,
      'id',
    );
    const lineItem = this.productToCartLineItem(product);
    if (cartId) {
      const cart = await this.cartModel
        .findOneAndUpdate(
          {
            _id: cartId,
          },
          {
            $push: {
              lineItems: lineItem,
            },
          },
          {
            new: true,
          },
        )
        .exec();
      return cart;
    } else {
      const cartItem = new this.cartModel({
        lineItems: [lineItem],
        createdAt: new Date().toISOString(),
        currency: {
          code: 'UAH',
        },
      });
      cartItem.save();
      return cartItem;
    }
  }

  async update(updateCartDto: UpdateCartDto, cartId: string, clientId: string) {
    const product = await this.productService.getProduct(
      updateCartDto.itemId,
      clientId,
    );
    const lineItem = this.productToCartLineItem(product);
    return this.cartModel
      .findOneAndUpdate(
        {
          _id: cartId,
        },
        {
          $push: {
            lineItems: lineItem,
          },
        },
        {
          new: true,
        },
      )
      .exec();
  }

  findById(id: string) {
    return this.cartModel.findById(id).exec();
  }

  findOne(id: string) {
    return this.cartModel.findOne({ id }).exec();
  }

  async remove(cartId: string, id: string) {
    // TODO update when PUT will be ready
    const model = await this.cartModel.findById(cartId).exec();
    if (model && model.lineItems.length === 1) {
      return this.cartModel.deleteOne({ _id: cartId }).exec();
    } else {
      return this.cartModel
        .findOneAndUpdate(
          { _id: cartId },
          {
            $pull: {
              lineItems: {
                id,
              },
            },
          },
          {
            new: true,
          },
        )
        .exec();
    }
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
