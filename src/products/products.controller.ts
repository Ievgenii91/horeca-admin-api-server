import {
  Body,
  Controller,
  Get,
  Param,
  Query,
  Post,
  UseGuards,
  ValidationPipe,
  Logger,
  UseInterceptors,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';
import { UpdateProductAvailabilityDto } from './dto/update-product-availability.dto';
import { TransformInterceptor } from 'src/common/response-transform.interceptor';
import { ClientId } from 'src/decorators/client-id.decorator';
import { RequiredValidationPipe } from 'src/common/required-validation.pipe';
import { GetProductsDto } from './dto/get-products.dto';
import { Product } from 'src/schemas/product.schema';
@UseInterceptors(TransformInterceptor)
@Controller('v1/products')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

  constructor(private productService: ProductsService) {}

  @Get()
  getProducts(@ClientId() clientId: string) {
    return this.productService.getProducts(clientId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    @Body(ValidationPipe)
    createOrUpdateProductDto: CreateProductDto | UpdateProductDto,
  ) {
    this.logger.log(`create product for ${createOrUpdateProductDto.clientId}`);
    return this.productService.createProduct(createOrUpdateProductDto);
  }

  @Get('/search')
  async searchProducts(
    @ClientId() clientId: string,
    @Query(ValidationPipe) getProductsDto: GetProductsDto,
  ): Promise<{ products: Product[]; found: boolean }> {
    const products = await this.productService.searchProducts(
      clientId,
      getProductsDto,
    );
    return {
      products,
      found: !!products.length,
    };
  }

  @Get('/categories')
  getCategories(@ClientId() clientId: string): Promise<string[]> {
    return this.productService.getCategories(clientId);
  }

  @Post('/available')
  updateProductAvailability(
    @Body(ValidationPipe) body: UpdateProductAvailabilityDto,
  ) {
    this.logger.log(
      `updateProductAvailability ${body.id}`,
      ProductsController.name,
    );
    return this.productService.updateProductAvailability(body);
  }

  //TODO: review get product to add filter product dto
  @Get('/slug/:slug')
  getProduct(
    @Param('slug', RequiredValidationPipe) slug: string,
    @ClientId() clientId: string,
  ) {
    this.logger.log(
      `get product slug ${slug} by ${clientId} clientId`,
      ProductsController.name,
    );
    return this.productService.getProduct(slug, clientId, 'slug');
  }

  @Get('/:id')
  getProductById(
    @Param('id', RequiredValidationPipe) id: string,
    @ClientId() clientId: string,
  ) {
    this.logger.log(
      `get product by params ${id} by ${clientId} clientId`,
      ProductsController.name,
    );
    return this.productService.getProduct(id, clientId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  deleteProduct(
    @Param('id', RequiredValidationPipe) id: string,
    @ClientId() clientId: string,
  ) {
    this.logger.log(`delete product ${id}`, ProductsController.name);
    return this.productService.deleteProduct({ id, clientId });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/:id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe)
    createOrUpdateProductDto: CreateProductDto | UpdateProductDto,
  ) {
    this.logger.log(`update product ${id}`, ProductsController.name);
    createOrUpdateProductDto.id = id;
    return this.productService.updateProduct(
      createOrUpdateProductDto as UpdateProductDto,
    );
  }
}
