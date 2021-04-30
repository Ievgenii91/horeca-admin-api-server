import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions } from 'mongoose';
import { Cart, CartDocument, LineItem } from 'src/schemas/cart.schema';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ProductService } from './../product/product.service';
import { Product } from 'src/schemas/product.schema';
import { Response } from 'express';

const options: Partial<QueryOptions> = {
  new: true,
  useFindAndModify: false,
};
const TWO_DAYS = 172800000;
@Injectable()
export class CartService {
  readonly cookieName = 'bc_cartId';

  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    private productService: ProductService,
  ) {}

  private productToCartLineItem(product: Product): LineItem {
    return {
      id: product.id,
      variantId: product['_id'],
      productId: product.id,
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
        image: {
          url:
            product.images && product.images.length
              ? product.images[0].url
              : null,
        },
      },
    };
  }

  async create(
    createCartDto: CreateCartDto,
    clientId: string,
    cartId: string,
  ): Promise<CartDocument> {
    const product = await this.productService.getProduct(
      createCartDto.productId,
      clientId,
      'id',
    );
    const lineItem = this.productToCartLineItem(product);
    const totalPrice = lineItem.variant.price;
    if (cartId) {
      const cart = await this.cartModel.findById(cartId);
      const item = cart.lineItems.find((v) => v.id === createCartDto.productId);
      if (!item) {
        return this.cartModel
          .findOneAndUpdate(
            {
              _id: cartId,
            },
            {
              $inc: {
                lineItemsSubtotalPrice: totalPrice,
                subtotalPrice: totalPrice,
                totalPrice: totalPrice,
              },
              $push: {
                lineItems: lineItem,
              },
            },
            options,
          )
          .exec();
      } else {
        return this.cartModel
          .findOneAndUpdate(
            {
              _id: cartId,
              'lineItems.id': createCartDto.productId,
            },
            {
              $inc: {
                lineItemsSubtotalPrice: totalPrice,
                subtotalPrice: totalPrice,
                totalPrice: totalPrice,
                'lineItems.$.quantity': 1,
              },
            },
            options,
          )
          .exec();
      }
    } else {
      const cartItem = new this.cartModel({
        lineItems: [lineItem],
        createdAt: new Date().toISOString(),
        currency: {
          code: 'UAH',
        },
        lineItemsSubtotalPrice: totalPrice,
        subtotalPrice: totalPrice,
        totalPrice: totalPrice,
      });
      cartItem.save();
      return cartItem;
    }
  }

  async update(
    updateCartDto: UpdateCartDto,
    cartId: string,
    clientId: string,
  ): Promise<Cart> {
    const product = await this.productService.getProduct(
      updateCartDto.itemId,
      clientId,
    );
    const lineItem = this.productToCartLineItem(product);
    let totalPrice = lineItem.variant.price;
    const cart = await this.cartModel.findById(cartId);
    const quantity = cart.lineItems.find((v) => v.id === updateCartDto.itemId)
      ?.quantity;

    if (quantity > updateCartDto.item.quantity) {
      totalPrice = -totalPrice;
    }

    return this.cartModel
      .findOneAndUpdate(
        {
          _id: cartId,
          'lineItems.id': updateCartDto.itemId,
        },
        {
          $set: {
            'lineItems.$.quantity': updateCartDto.item.quantity,
          },
          $inc: {
            lineItemsSubtotalPrice: totalPrice,
            subtotalPrice: totalPrice,
            totalPrice: totalPrice,
          },
        },
        options,
      )
      .exec();
  }

  findById(id: string): Promise<Cart> {
    return this.cartModel.findById(id).exec();
  }

  findOne(id: string): Promise<Cart> {
    return this.cartModel.findOne({ id }).exec();
  }

  async remove(cartId: string, id: string): Promise<Cart> | null {
    const cart = await this.cartModel
      .findOneAndUpdate(
        { _id: cartId },
        {
          $pull: {
            lineItems: {
              id,
            },
          },
        },
        options,
      )
      .exec();
    if (!cart.lineItems.length) {
      await this.cartModel.deleteOne({ _id: cartId }).exec();
      return null;
    } else {
      return cart;
    }
  }

  setCartInCookie(response: Response, value: string, maxAge = TWO_DAYS): void {
    response.cookie(this.cookieName, decodeURI(value), {
      httpOnly: false,
      sameSite: 'none',
      secure: true,
      maxAge,
    });
  }

  clearCookie(response: Response): void {
    response.clearCookie(this.cookieName);
    this.setCartInCookie(response, null, 0);
  }
}
