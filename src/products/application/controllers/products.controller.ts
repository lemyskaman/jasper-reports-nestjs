import { Controller, Get, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateProductDto } from '../dtos/create-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { ProductRepository } from '../../infrastructure/repositories/product.repository';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productRepo: ProductRepository) {}

  @Get()
  async findAll(): Promise<CreateProductDto[]> {
    // Map ORM entities to DTOs for output
    const products = await this.productRepo.findAll();
    return products.map((p) => ({
      name: p.name,
      price: Number(p.price),
      description: p.description,
    }));
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
  async create(@Body() createProductDto: CreateProductDto): Promise<CreateProductDto> {
    const product = await this.productRepo.save(createProductDto);
    return {
      name: product.name,
      price: Number(product.price),
      description: product.description,
    };
  }
}
