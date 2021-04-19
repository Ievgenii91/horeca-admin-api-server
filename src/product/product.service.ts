import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client, ClientDocument } from 'src/schemas/client.schema';
import { Product } from 'src/schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { DeleteProductDto } from './dto/delete-product.dto';
import { GetProductsDto } from './dto/get-products.dto';
import { UpdateProductAvailabilityDto } from './dto/update-product-availability.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
  ) {}

  async getProducts(getProductsDto: GetProductsDto): Promise<Product[]> {
    const { products } = await this.clientModel
      .findById(getProductsDto.clientId)
      .exec();
    return products;
  }

  async getProduct(id: string, clientId: string) {
    const products = await this.getProducts({ clientId });
    return products.find((v) => v.id === id);
  }

  async createProduct(createProductDto: CreateProductDto) {
    const product = new Product(createProductDto);
    return this.clientModel
      .updateOne(
        {
          _id: createProductDto.clientId,
        },
        {
          $push: {
            products: product,
          },
        },
      )
      .exec();
  }

  async updateProduct(createProductDto: UpdateProductDto) {
    return this.clientModel
      .updateOne(
        {
          _id: createProductDto.clientId,
          'products.id': createProductDto.id,
        },
        {
          $set: {
            'products.$.name': createProductDto.name,
            'products.$.description': createProductDto.description,
            'products.$.fancyName': createProductDto.fancyName,
            'products.$.category': createProductDto.category,
            'products.$.subCategory': createProductDto.subCategory,
            'products.$.additionalText': createProductDto.additionalText,
            'products.$.available': createProductDto.available,
            'products.$.price': createProductDto.price,
            'products.$.editMode': false,
            'products.$.type': createProductDto.type,
            'products.$.crossSales': createProductDto.crossSales,
            'products.$.usedForCrossSales': createProductDto.usedForCrossSales,
          },
        },
      )
      .exec();
  }

  async updateProductAvailability(
    updateProductAvailabilityDto: UpdateProductAvailabilityDto,
  ) {
    const { clientId, id, available } = updateProductAvailabilityDto;

    return this.clientModel
      .updateOne(
        {
          _id: clientId,
          'products.id': id,
        },
        {
          $set: {
            'products.$.available': available,
          },
        },
      )
      .exec();
  }

  async deleteProduct(deleteProductDto: DeleteProductDto) {
    const { id, clientId } = deleteProductDto;
    return this.clientModel
      .updateOne(
        {
          _id: clientId,
        },
        {
          $pull: {
            products: {
              id,
            },
          },
        },
      )
      .exec();
  }
}
