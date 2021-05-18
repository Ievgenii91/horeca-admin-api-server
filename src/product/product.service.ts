import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions } from 'mongoose';
import { Product, ProductDocument } from 'src/schemas/product.schema';
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
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async searchProducts(clientId: string, getProductsDto?: GetProductsDto) {
    this.logger.log(
      `Products search performed ${JSON.stringify(
        getProductsDto,
      )} for client ${clientId}`,
      ProductService.name,
    );
    let sort = {};
    if (getProductsDto.sort) {
      const val = getProductsDto.sort;
      const dir = (asc: string, desc: string): number => {
        return (val === asc && 1) || (val === desc && -1);
      };
      sort = {
        ...sort,
        name: dir('asc', 'desc'),
        price: dir('price-asc', 'price-desc'),
        date: dir('latest-asc', 'latest-desc'),
        rating: dir('trending-asc', 'trending-desc'),
      };
      delete getProductsDto.sort;
    }
    const query = { ...getProductsDto, clientId };
    if (getProductsDto.search) {
      // text search index is set for name and additionalText fields in doc.
      return this.productModel
        .find({
          $text: { $search: getProductsDto.search },
        })
        .sort(sort);
    }
    return this.productModel.find(query).sort(sort);
  }

  async getProducts(clientId: string): Promise<Product[]> {
    return this.productModel.find({ clientId }).exec();
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
    const product = new this.productModel(new Product(createProductDto));
    return product.save();
  }

  async updateProduct(updateProductDto: UpdateProductDto) {
    this.logger.log(
      `Product UPDATE performed ${JSON.stringify(
        updateProductDto,
      )} for client ${updateProductDto.clientId}`,
      ProductService.name,
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

  async updateProductAvailability(
    updateProductAvailabilityDto: UpdateProductAvailabilityDto,
  ) {
    const { clientId, id, available } = updateProductAvailabilityDto;

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

  async deleteProduct(deleteProductDto: DeleteProductDto) {
    const { id, clientId } = deleteProductDto;
    return this.productModel
      .findOneAndDelete({
        clientId,
        id,
      })
      .exec();
  }
}
