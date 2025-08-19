import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from '../src/products/application/controllers/products.controller';
import { ProductRepository } from '../src/products/infrastructure/repositories/product.repository';
import { CreateProductDto } from '../src/products/application/dtos/create-product.dto';

describe('ProductsController (NestJS)', () => {
  let controller: ProductsController;
  let repo: ProductRepository;

  beforeEach(async () => {
    const repoMock = {
      findAll: jest.fn(),
      save: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        { provide: ProductRepository, useValue: repoMock },
      ],
    }).compile();
    controller = module.get(ProductsController);
    repo = module.get(ProductRepository);
  });

  it('should return all products', async () => {
    const products = [
      { name: 'A', price: 1, description: 'desc' },
      { name: 'B', price: 2, description: 'desc2' },
    ];
    (repo.findAll as jest.Mock).mockResolvedValue(products);
    const result = await controller.findAll();
    expect(result).toEqual(products);
    expect(repo.findAll).toHaveBeenCalled();
  });

  it('should create a product', async () => {
    const dto: CreateProductDto = { name: 'C', price: 3, description: 'desc3' };
    (repo.save as jest.Mock).mockResolvedValue(dto);
    const result = await controller.create(dto);
    expect(result).toEqual(dto);
    expect(repo.save).toHaveBeenCalledWith(dto);
  });
});
