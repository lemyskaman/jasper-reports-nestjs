import { Controller, Get, Post, Body, UsePipes, ValidationPipe, Param, Delete, HttpCode, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from '../dtos/create-product.dto';
import { ProductDto } from '../dtos/product.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ProductService } from '../use-cases/product.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Return all products', type: [ProductDto] })
  async findAll(): Promise<ProductDto[]> {
    return this.productService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Return the product', type: ProductDto })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findOne(@Param('id') id: string): Promise<ProductDto> {
    const product = await this.productService.findById(Number(id));
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'The product has been created', type: ProductDto })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
  async create(@Body() createProductDto: CreateProductDto): Promise<ProductDto> {
    return this.productService.create(createProductDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 204, description: 'The product has been deleted' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async remove(@Param('id') id: string): Promise<void> {
    const deleted = await this.productService.delete(Number(id));
    if (!deleted) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }
}
