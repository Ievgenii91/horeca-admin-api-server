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

  textSearch(v: Product, getProductsDto?: GetProductsDto) {
    const values = [v.name, v.description, v.fancyName, v.category];
    for (let i = 0; i < values.length; i++) {
      if (
        values[i]?.toLowerCase().includes(getProductsDto.search.toLowerCase())
      ) {
        return v;
      }
    }
  }

  async searchProducts(clientId: string, getProductsDto?: GetProductsDto) {
    this.logger.log(
      `Products search performed ${JSON.stringify(
        getProductsDto,
      )} for client ${clientId}`,
      ProductService.name,
    );
    const products = await this.productModel.find({ clientId }).sort({
      price: getProductsDto.sortByPrice === 'asc' ? 1 : -1,
    });
    // TODO: sort search in DB
    return products.filter((v) => {
      if (getProductsDto.search) {
        return this.textSearch(v, getProductsDto);
      }
      if (getProductsDto.category) {
        return v.category.includes(getProductsDto.category);
      }
      return v;
    });
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
