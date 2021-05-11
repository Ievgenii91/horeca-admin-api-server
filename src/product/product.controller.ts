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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { DeleteProductDto } from './dto/delete-product.dto';
import { UpdateProductAvailabilityDto } from './dto/update-product-availability.dto';
import { TransformInterceptor } from 'src/common/response-transform.interceptor';
import { ClientId } from 'src/decorators/client-id.decorator';
import { RequiredValidationPipe } from 'src/common/required-validation.pipe';
import { GetProductsDto } from './dto/get-products.dto';
import { Product } from 'src/schemas/product.schema';
@UseInterceptors(TransformInterceptor)
@Controller()
export class ProductController {
  private readonly logger = new Logger(ProductController.name);

  constructor(private productService: ProductService) {}

  @Get('product/all')
  getProducts(@ClientId() clientId: string) {
    return this.productService.getProducts(clientId);
  }

  @Get('product/search')
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

  @Get('product/categories')
  getCategories(@ClientId() clientId: string): Promise<string[]> {
    return this.productService.getCategories(clientId);
  }

  @Post('product/available')
  updateProductAvailability(
    @Body(ValidationPipe) body: UpdateProductAvailabilityDto,
  ) {
    this.logger.log(
      `updateProductAvailability ${body.id}`,
      ProductController.name,
    );
    return this.productService.updateProductAvailability(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('product')
  create(
    @Body(ValidationPipe)
    createOrUpdateProductDto: CreateProductDto | UpdateProductDto,
  ) {
    this.logger.log(`create product for ${createOrUpdateProductDto.clientId}`);
    return this.productService.createProduct(createOrUpdateProductDto);
  }

  //TODO: review get product to add filter product dto
  @Get('product/:slug')
  getProduct(
    @Param('slug', RequiredValidationPipe) slug: string,
    @ClientId() clientId: string,
  ) {
    this.logger.log(
      `get product slug ${slug} by ${clientId} clientId`,
      ProductController.name,
    );
    return this.productService.getProduct(slug, clientId, 'slug');
  }

  @Get('product')
  getProductById(
    @Query('id', RequiredValidationPipe) id: string,
    @ClientId() clientId: string,
  ) {
    this.logger.log(
      `get product by params ${id} by ${clientId} clientId`,
      ProductController.name,
    );
    return this.productService.getProduct(id, clientId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('product/delete')
  deleteProduct(@Body(ValidationPipe) deleteProductDto: DeleteProductDto) {
    this.logger.log(
      `delete product ${deleteProductDto.id}`,
      ProductController.name,
    );
    return this.productService.deleteProduct(deleteProductDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('product/:id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe)
    createOrUpdateProductDto: CreateProductDto | UpdateProductDto,
  ) {
    this.logger.log(`update product ${id}`, ProductController.name);
    createOrUpdateProductDto.id = id;
    return this.productService.updateProduct(
      createOrUpdateProductDto as UpdateProductDto,
    );
  }
}
