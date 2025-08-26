import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductRepository } from '../src/products/infrastructure/repositories/product.repository';
import { ProductOrmEntity } from '../src/products/infrastructure/entities/product.orm-entity';
import { Repository } from 'typeorm';
import { Product } from '../src/products/domain/product.entity';

describe('ProductRepository (NestJS)', () => {
  let repo: ProductRepository;
  let dbMock: Partial<Record<keyof Repository<ProductOrmEntity>, jest.Mock>>;

  beforeEach(async () => {
    dbMock = {
      save: jest.fn(),
      find: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductRepository,
        {
          provide: getRepositoryToken(ProductOrmEntity),
          useValue: dbMock,
        },
      ],
    }).compile();
    repo = module.get(ProductRepository);
  });

  it('should save a product', async () => {
    const product = new Product({
      name: 'Test',
      price: 10.5,
      description: 'desc',
    });
    const ormEntity = {
      name: product.name,
      price: product.price,
      description: product.description,
    };
    dbMock.save!.mockResolvedValue(ormEntity);
    const result = await repo.save(product);
    expect(result).toMatchObject({ name: 'Test', price: 10.5, description: 'desc' });
    expect(dbMock.save).toHaveBeenCalledWith(expect.objectContaining(ormEntity));
  });

  it('should find all products', async () => {
    const products: Partial<ProductOrmEntity>[] = [
      { name: 'A', price: 1, description: 'desc' },
      { name: 'B', price: 2, description: 'desc2' },
    ];
    dbMock.find!.mockResolvedValue(products);
    const result = await repo.findAll();
    expect(result[0]).toMatchObject({ name: 'A', price: 1, description: 'desc' });
    expect(result[1]).toMatchObject({ name: 'B', price: 2, description: 'desc2' });
    expect(dbMock.find).toHaveBeenCalled();
  });
});
