import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions } from 'mongoose';
import { Product, ProductDocument } from 'src/schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductsDto } from './dto/get-products.dto';
import {
  RemoveProductDto,
  RemoveProductImageDto,
} from './dto/remove-product-image.dto';
import { UpdateProductAvailabilityDto } from './dto/update-product-availability.dto';
import { UpdateProductDto } from './dto/update-product.dto';

const options: Partial<QueryOptions> = {
  new: true,
  useFindAndModify: false,
};
@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async searchProducts(
    clientId: string,
    getProductsDto?: GetProductsDto,
  ): Promise<Product[]> {
    this.logger.log(
      `SEARCH products ${JSON.stringify(
        getProductsDto,
      )} for client ${clientId}`,
      ProductsService.name,
    );
    const query = { ...getProductsDto, clientId, visible: true };
    if (getProductsDto.search) {
      // text search index is set for name and additionalText fields in doc.
      // TODO set index in tags field
      return this.productModel
        .find({
          $text: { $search: getProductsDto.search },
        })
        .exec();
    }
    return this.productModel.find(query as any).exec();
  }

  async getProducts(clientId: string): Promise<Product[]> {
    this.logger.log(
      `GET all products for client ${clientId}`,
      ProductsService.name,
    );
    return this.productModel.find({ clientId }).exec();
  }

  async getCategories(clientId: string) {
    this.logger.warn('[DEPRECATED] getCategories ', ProductsService.name);
    this.logger.log(
      `GET all product categories for client ${clientId}`,
      ProductsService.name,
    );
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
    this.logger.log(
      `GET product ${param} for client ${clientId}`,
      ProductsService.name,
    );
    const products = await this.getProducts(clientId);
    return products.find((v) => v[param] === value);
  }

  async createProduct(createProductDto: CreateProductDto) {
    this.logger.log(
      `CREATE product ${createProductDto.name} for client ${createProductDto.clientId}`,
      ProductsService.name,
    );
    const product = new this.productModel(new Product(createProductDto));
    return product.save();
  }

  async updateProduct(updateProductDto: UpdateProductDto): Promise<Product> {
    this.logger.log(
      `UPDATE product ${updateProductDto.name} for client ${updateProductDto.clientId}`,
      ProductsService.name,
    );
    return this.productModel
      .findOneAndUpdate(
        {
          clientId: updateProductDto.clientId,
          id: updateProductDto.id,
        },
        {
          $set: {
            ...updateProductDto,
            editMode: false,
          },
        },
        options,
      )
      .exec();
  }

  async removeImage(
    imageKey: string,
    updateProductDto: RemoveProductImageDto,
  ): Promise<Product> {
    this.logger.log(
      `REMOVE image for product ${updateProductDto.id} for client ${updateProductDto.clientId}`,
      ProductsService.name,
    );
    return this.productModel
      .findOneAndUpdate(
        {
          clientId: updateProductDto.clientId,
          id: updateProductDto.id,
        },
        {
          $pull: {
            images: {
              key: imageKey,
            },
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
    this.logger.log(
      `TOGGLE product avaliability for client ${updateProductAvailabilityDto.clientId}`,
      ProductsService.name,
    );

    return this.productModel
      .findOneAndUpdate(
        {
          clientId,
          id,
        },
        {
          $set: {
            available,
          },
        },
        options,
      )
      .exec();
  }

  async deleteProduct(deleteProductDto: RemoveProductDto) {
    // TODO delete images from s3 when deleting product
    const { id, clientId } = deleteProductDto;
    this.logger.log(
      `DELETE product for client ${clientId}`,
      ProductsService.name,
    );
    return this.productModel
      .findOneAndDelete({
        clientId,
        id,
      })
      .exec();
  }
}
