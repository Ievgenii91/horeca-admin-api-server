import {
  Body,
  Controller,
  Get,
  Param,
  Query,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductsDto } from './dto/get-products.dto';
import { ProductService } from './product.service';
import { DeleteProductDto } from './dto/delete-product.dto';
import { UpdateProductAvailabilityDto } from './dto/update-product-availability.dto';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}
  @Get('/all')
  getProducts(@Query(ValidationPipe) getProductsDto: GetProductsDto) {
    return this.productService.getProducts(getProductsDto);
  }

  @Post('/available')
  updateProductAvailability(@Body() body: UpdateProductAvailabilityDto) {
    return this.productService.updateProductAvailability(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    @Body(ValidationPipe)
    createOrUpdateProductDto: CreateProductDto | UpdateProductDto,
  ) {
    return this.productService.createProduct(createOrUpdateProductDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/:id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe)
    createOrUpdateProductDto: CreateProductDto | UpdateProductDto,
  ) {
    createOrUpdateProductDto.id = id;
    return this.productService.updateProduct(
      createOrUpdateProductDto as UpdateProductDto,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/delete')
  deleteProduct(@Body(ValidationPipe) deleteProductDto: DeleteProductDto) {
    return this.productService.deleteProduct(deleteProductDto);
  }
}
