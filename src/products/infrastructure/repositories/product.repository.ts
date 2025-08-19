import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductOrmEntity } from '../entities/product.orm-entity';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly repo: Repository<ProductOrmEntity>,
  ) {}

  async save(product: Partial<ProductOrmEntity>) {
    return this.repo.save(product);
  }

  async findAll() {
    return this.repo.find();
  }
}
