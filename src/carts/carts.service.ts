import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions } from 'mongoose';
import { Cart, CartDocument, LineItem } from 'src/schemas/cart.schema';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ProductsService } from '../products/products.service';
import { Product } from 'src/schemas/product.schema';
import { Response } from 'express';

const options: Partial<QueryOptions> = {
  new: true,
  useFindAndModify: false,
};
const TWO_DAYS = 172800000;
const SHIPPING_PRICE = 33;
const PACKAGING_PRICE = 5;
@Injectable()
export class CartsService {
  readonly cookieName = 'bc_cartId';

  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    private productService: ProductsService,
  ) {}

  getPackagingPrice(lineItems: LineItem[], price: number) {
    let total = 0;
    lineItems.forEach((v) => {
      total += v.quantity * price;
    });
    return total;
  }

  getTotalPrice(
    totalPrice: number,
    requiresShipping: boolean,
    packagingPrice: number,
  ): number {
    return (
      (requiresShipping ? totalPrice + SHIPPING_PRICE : totalPrice) +
      packagingPrice
    );
  }

  productToCartLineItem(product: Product): LineItem {
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
        requiresShipping: null,
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
    let packagingPrice = this.getPackagingPrice([lineItem], PACKAGING_PRICE);
    const totalPrice = lineItem.variant.price;
    if (cartId) {
      const cart = await this.cartModel.findById(cartId);
      if (!cart) {
        return this.createCartItem(
          lineItem,
          createCartDto.requiresShipping,
          packagingPrice,
        );
      }
      packagingPrice = this.getPackagingPrice(
        [...cart.lineItems, lineItem],
        PACKAGING_PRICE,
      );
      const item = cart.lineItems.find((v) => v.id === createCartDto.productId);
      const commonFieldsToIncrement = {
        lineItemsSubtotalPrice: totalPrice,
        subtotalPrice: totalPrice,
        totalPrice: this.getTotalPrice(
          totalPrice,
          createCartDto.requiresShipping,
          packagingPrice,
        ),
      };
      const commonFieldsToSet = {
        requiresShipping: createCartDto.requiresShipping,
      };
      if (!item) {
        return this.cartModel
          .findOneAndUpdate(
            {
              _id: cartId,
            },
            {
              $set: commonFieldsToSet,
              $inc: commonFieldsToIncrement,
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
              $set: commonFieldsToSet,
              $inc: {
                ...commonFieldsToIncrement,
                'lineItems.$.quantity': 1,
              },
            },
            options,
          )
          .exec();
      }
    } else {
      return this.createCartItem(
        lineItem,
        createCartDto.requiresShipping,
        packagingPrice,
      );
    }
  }

  async createCartItem(
    lineItem: LineItem,
    requiresShipping: boolean,
    packagingPrice: number,
  ): Promise<CartDocument> {
    const totalPrice = lineItem.variant.price;
    const cartItem = new this.cartModel({
      lineItems: [lineItem],
      createdAt: new Date().toISOString(),
      currency: {
        code: 'UAH',
      },
      requiresShipping,
      lineItemsSubtotalPrice: totalPrice,
      subtotalPrice: totalPrice,
      totalPrice: this.getTotalPrice(
        totalPrice,
        requiresShipping,
        packagingPrice,
      ),
    });
    await cartItem.save();
    return cartItem;
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
    const quantity = cart.lineItems.find(
      (v) => v.id === updateCartDto.itemId,
    )?.quantity;
    let delta = false;
    if (quantity > updateCartDto.item.quantity) {
      delta = true;
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
            requiresShipping: updateCartDto.requiresShipping,
            'lineItems.$.quantity': updateCartDto.item.quantity,
          },
          $inc: {
            lineItemsSubtotalPrice: totalPrice,
            subtotalPrice: totalPrice,
            totalPrice: delta
              ? totalPrice - PACKAGING_PRICE
              : totalPrice + PACKAGING_PRICE,
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
    // TODO: remove duplicate req, using additional values from FE or aggregation.
    const data = await this.cartModel.findById(cartId);
    const productToDelete = data?.lineItems.find((v) => v.id === id);
    const price =
      productToDelete?.variant.price * productToDelete.quantity || 0;
    // eof
    const total = this.getTotalPrice(
      price,
      false,
      this.getPackagingPrice([productToDelete], PACKAGING_PRICE),
    );
    const cart = await this.cartModel
      .findOneAndUpdate(
        { _id: cartId },
        {
          $inc: {
            lineItemsSubtotalPrice: -price,
            subtotalPrice: -price,
            totalPrice: -total,
          },
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
