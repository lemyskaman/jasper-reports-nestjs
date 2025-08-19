import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductRepository } from '../src/products/infrastructure/repositories/product.repository';
import { ProductOrmEntity } from '../src/products/infrastructure/entities/product.orm-entity';
import { Repository } from 'typeorm';

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
    const product: Partial<ProductOrmEntity> = {
      name: 'Test',
      price: 10.5,
      description: 'desc',
    };
    dbMock.save!.mockResolvedValue(product);
    const result = await repo.save(product);
    expect(result).toBe(product);
    expect(dbMock.save).toHaveBeenCalledWith(product);
  });

  it('should find all products', async () => {
    const products: Partial<ProductOrmEntity>[] = [
      { name: 'A', price: 1, description: 'desc' },
      { name: 'B', price: 2, description: 'desc2' },
    ];
    dbMock.find!.mockResolvedValue(products);
    const result = await repo.findAll();
    expect(result).toBe(products);
    expect(dbMock.find).toHaveBeenCalled();
  });
});
