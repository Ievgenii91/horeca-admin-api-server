import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions } from 'mongoose';
import { Client, ClientDocument } from 'src/schemas/client.schema';
import { Product } from 'src/schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { DeleteProductDto } from './dto/delete-product.dto';
import { GetProductsDto } from './dto/get-products.dto';
import { UpdateProductAvailabilityDto } from './dto/update-product-availability.dto';
import { UpdateProductDto } from './dto/update-product.dto';

const options: Partial<QueryOptions> = {
  new: true,
  useFindAndModify: false,
};
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

  async getProduct(
    value: string,
    clientId: string,
    param = 'id',
  ): Promise<Product> {
    const products = await this.getProducts({ clientId });
    return products.find((v) => v[param] === value);
  }

  async createProduct(createProductDto: CreateProductDto) {
    const product = new Product(createProductDto);
    return this.clientModel
      .findOneAndUpdate(
        {
          _id: createProductDto.clientId,
        },
        {
          $push: {
            products: product,
          },
        },
        options,
      )
      .exec();
  }

  async updateProduct(updateProductDto: UpdateProductDto) {
    return this.clientModel
      .findOneAndUpdate(
        {
          _id: updateProductDto.clientId,
          'products.id': updateProductDto.id,
        },
        {
          $set: {
            'products.$.name': updateProductDto.name,
            'products.$.description': updateProductDto.description,
            'products.$.fancyName': updateProductDto.fancyName,
            'products.$.category': updateProductDto.category,
            'products.$.subCategory': updateProductDto.subCategory,
            'products.$.additionalText': updateProductDto.additionalText,
            'products.$.available': updateProductDto.available,
            'products.$.price': updateProductDto.price,
            'products.$.editMode': false,
            'products.$.type': updateProductDto.type,
            'products.$.crossSales': updateProductDto.crossSales,
            'products.$.slug': updateProductDto.slug,
            'products.$.path': updateProductDto.path,
            'products.$.images': updateProductDto.images,
            'products.$.usedForCrossSales': updateProductDto.usedForCrossSales,
          },
        },
        options,
      )
      .exec();
  }

  async updateProductAvailability(
    updateProductAvailabilityDto: UpdateProductAvailabilityDto,
  ) {
    const { clientId, id, available } = updateProductAvailabilityDto;

    return this.clientModel
      .findOneAndUpdate(
        {
          _id: clientId,
          'products.id': id,
        },
        {
          $set: {
            'products.$.available': available,
          },
        },
        options,
      )
      .exec();
  }

  async deleteProduct(deleteProductDto: DeleteProductDto) {
    const { id, clientId } = deleteProductDto;
    return this.clientModel
      .findOneAndUpdate(
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
        options,
      )
      .exec();
  }
}
