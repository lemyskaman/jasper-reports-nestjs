import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductOrmEntity } from '../entities/product.orm-entity';
import { Product } from '../../domain/product.entity';
import { ProductRepositoryPort } from '../../domain/product.repository.port';

@Injectable()
export class ProductRepository implements ProductRepositoryPort {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly repo: Repository<ProductOrmEntity>,
  ) {}

  async findAll(): Promise<Product[]> {
    const ormEntities = await this.repo.find();
    return ormEntities.map(this.toDomainEntity);
  }

  async findById(id: number): Promise<Product | null> {
    const ormEntity = await this.repo.findOne({ where: { id } });
    return ormEntity ? this.toDomainEntity(ormEntity) : null;
  }

  async save(product: Product): Promise<Product> {
    const ormEntity = this.toOrmEntity(product);
    const savedEntity = await this.repo.save(ormEntity);
    return this.toDomainEntity(savedEntity);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  // Mapper methods
  private toDomainEntity(ormEntity: ProductOrmEntity): Product {
    return new Product({
      id: ormEntity.id,
      name: ormEntity.name,
      price: Number(ormEntity.price),
      description: ormEntity.description,
    });
  }

  private toOrmEntity(domainEntity: Product): ProductOrmEntity {
    const ormEntity = new ProductOrmEntity();
    
    // Only set ID if it exists in the domain entity
    if (domainEntity.id) {
      ormEntity.id = domainEntity.id;
    }
    
    ormEntity.name = domainEntity.name;
    ormEntity.price = domainEntity.price;
    ormEntity.description = domainEntity.description ?? '';

    return ormEntity;
  }
}
