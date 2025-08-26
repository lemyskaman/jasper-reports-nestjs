import { Injectable, Inject } from '@nestjs/common';
import { Product } from '../../domain/product.entity';
import { ProductRepositoryPort } from '../../domain/product.repository.port';
import { CreateProductDto } from '../dtos/create-product.dto';
import { ProductDto } from '../dtos/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @Inject('ProductRepositoryPort')
    private readonly productRepository: ProductRepositoryPort
  ) {}

  /**
   * Get all products
   * @returns Promise resolving to an array of ProductDto
   */
  async findAll(): Promise<ProductDto[]> {
    const products = await this.productRepository.findAll();
    return products.map(this.toDto);
  }

  /**
   * Get a product by ID
   * @param id The ID of the product to find
   * @returns Promise resolving to a ProductDto or null if not found
   */
  async findById(id: number): Promise<ProductDto | null> {
    const product = await this.productRepository.findById(id);
    return product ? this.toDto(product) : null;
  }

  /**
   * Create a new product
   * @param createProductDto The DTO containing product creation data
   * @returns Promise resolving to the created ProductDto
   */
  async create(createProductDto: CreateProductDto): Promise<ProductDto> {
    const product = new Product({
      name: createProductDto.name,
      price: createProductDto.price,
      description: createProductDto.description,
    });

    const savedProduct = await this.productRepository.save(product);
    return this.toDto(savedProduct);
  }

  /**
   * Delete a product
   * @param id The ID of the product to delete
   * @returns Promise resolving to a boolean indicating success
   */
  async delete(id: number): Promise<boolean> {
    return this.productRepository.delete(id);
  }

  /**
   * Map a domain entity to a DTO
   * @param product The Product domain entity
   * @returns The ProductDto
   */
  private toDto(product: Product): ProductDto {
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
    };
  }
}