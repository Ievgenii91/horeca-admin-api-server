import { Injectable, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
  ) {}

  async getProducts(
    clientId: string,
    getProductsDto?: GetProductsDto,
  ): Promise<Product[]> {
    // delete getProductsDto.clientId;
    // this.logger.warn(JSON.stringify(getProductsDto));
    // if (Object.keys(getProductsDto).length) {
    //   const filter = {};
    //   const sort = {};
    //   if (getProductsDto.search) {
    //     filter['products.name'] = new RegExp(getProductsDto.search);
    //   }
    //   if (getProductsDto.category) {
    //     filter['products.category'] = getProductsDto.category;
    //   }
    //   if (getProductsDto.sortByPrice) {
    //     sort['products.price'] = getProductsDto.sortByPrice ? 1 : 0;
    //   }

    //   const { products } = await this.clientModel
    //     .findOne({
    //       _id: clientId,
    //       ...filter,
    //     })
    //     .sort(sort)
    //     .exec();
    //   return products;
    // } else {
    const { products } = await this.clientModel.findById(clientId).exec();
    return products;
    //}
  }

  async getCategories(clientId: string) {
    const products = await this.getProducts(clientId);
    return products.reduce((prev, product) => {
      if (prev.length && prev[prev.length].category !== product.category) {
        return [...prev, product.category];
      } else {
        return prev;
      }
    }, []);
  }

  async getProduct(
    value: string,
    clientId: string,
    param = 'id',
  ): Promise<Product> {
    const products = await this.getProducts(clientId);
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
