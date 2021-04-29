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
import { GetProductsDto } from './dto/get-products.dto';
import { ProductService } from './product.service';
import { DeleteProductDto } from './dto/delete-product.dto';
import { UpdateProductAvailabilityDto } from './dto/update-product-availability.dto';
import { TransformInterceptor } from 'src/common/response-transform.interceptor';
import { ClientId } from 'src/decorators/client-id.decorator';
import { RequiredValidationPipe } from 'src/common/required-validation.pipe';

@UseInterceptors(TransformInterceptor)
@Controller('product')
export class ProductController {
  private readonly logger = new Logger(ProductController.name);

  constructor(private productService: ProductService) {}
  @Get('/all')
  getProducts(@Query(ValidationPipe) getProductsDto: GetProductsDto) {
    return this.productService.getProducts(getProductsDto);
  }

  @Post('/available')
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
  @Post()
  create(
    @Body(ValidationPipe)
    createOrUpdateProductDto: CreateProductDto | UpdateProductDto,
  ) {
    this.logger.log(`create product for ${createOrUpdateProductDto.clientId}`);
    return this.productService.createProduct(createOrUpdateProductDto);
  }

  //TODO: review get product to add filter product dto
  @Get('/:slug')
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

  @Get()
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
  @Post('/delete')
  deleteProduct(@Body(ValidationPipe) deleteProductDto: DeleteProductDto) {
    this.logger.log(
      `delete product ${deleteProductDto.id}`,
      ProductController.name,
    );
    return this.productService.deleteProduct(deleteProductDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/:id')
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
