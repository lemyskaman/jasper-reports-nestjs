import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from '../src/products/application/controllers/products.controller';
import { ProductService } from '../src/products/application/use-cases/product.service';
import { CreateProductDto } from '../src/products/application/dtos/create-product.dto';
import { ProductRepositoryPort } from '../src/products/domain/product.repository.port';
import { Product } from '../src/products/domain/product.entity';

describe('ProductsController (NestJS)', () => {
  let controller: ProductsController;

  beforeEach(async () => {
    const repoMock: ProductRepositoryPort = {
      findAll: jest.fn(async () => [
        new Product({ name: 'A', price: 1, description: 'desc' }),
        new Product({ name: 'B', price: 2, description: 'desc2' })
      ]),
      findById: jest.fn(async (id: number) => new Product({ name: 'A', price: 1, description: 'desc' })),
      save: jest.fn(async (product: Product) => product),
      delete: jest.fn(async (id: number) => true),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        { provide: 'ProductRepositoryPort', useValue: repoMock },
        ProductService,
      ],
    }).compile();
    controller = module.get(ProductsController);
  });

  it('should return all products', async () => {
    const result = await controller.findAll();
    expect(result[0]).toMatchObject({ name: 'A', price: 1, description: 'desc' });
    expect(result[1]).toMatchObject({ name: 'B', price: 2, description: 'desc2' });
  });

  it('should create a product', async () => {
    const dto: CreateProductDto = { name: 'C', price: 3, description: 'desc3' };
    const result = await controller.create(dto);
    expect(result).toMatchObject({ name: 'C', price: 3, description: 'desc3' });
  });
});
