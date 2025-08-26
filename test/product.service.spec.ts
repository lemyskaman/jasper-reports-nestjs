import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../src/products/application/use-cases/product.service';
import { Product } from '../src/products/domain/product.entity';
import { ProductRepositoryPort } from '../src/products/domain/product.repository.port';
import { CreateProductDto } from '../src/products/application/dtos/create-product.dto';

describe('ProductService', () => {
  let service: ProductService;
  let mockRepository: jest.Mocked<ProductRepositoryPort>;

  beforeEach(async () => {
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: 'ProductRepositoryPort',
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of product DTOs', async () => {
      const products = [
        new Product({ id: 1, name: 'Product 1', price: 10 }),
        new Product({ id: 2, name: 'Product 2', price: 20 }),
      ];
      mockRepository.findAll.mockResolvedValue(products);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[0].name).toBe('Product 1');
      expect(result[0].price).toBe(10);
      expect(result[1].id).toBe(2);
      expect(result[1].name).toBe('Product 2');
      expect(result[1].price).toBe(20);
      expect(mockRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a product DTO when product exists', async () => {
      const product = new Product({ id: 1, name: 'Product 1', price: 10 });
      mockRepository.findById.mockResolvedValue(product);

      const result = await service.findById(1);

      expect(result).toBeDefined();
      expect(result?.id).toBe(1);
      expect(result?.name).toBe('Product 1');
      expect(result?.price).toBe(10);
      expect(mockRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should return null when product does not exist', async () => {
      mockRepository.findById.mockResolvedValue(null);

      const result = await service.findById(999);

      expect(result).toBeNull();
      expect(mockRepository.findById).toHaveBeenCalledWith(999);
    });
  });

  describe('create', () => {
    it('should create and return a new product DTO', async () => {
      const createDto: CreateProductDto = {
        name: 'New Product',
        price: 15.99,
        description: 'New product description',
      };

      const savedProduct = new Product({
        id: 1,
        name: createDto.name,
        price: createDto.price,
        description: createDto.description,
      });

      mockRepository.save.mockImplementation(async (product: Product) => {
        // Simulate adding an ID when saving
        return new Product({
          id: 1,
          name: product.name,
          price: product.price,
          description: product.description,
        });
      });

      const result = await service.create(createDto);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.name).toBe('New Product');
      expect(result.price).toBe(15.99);
      expect(result.description).toBe('New product description');
      expect(mockRepository.save).toHaveBeenCalled();
      const savedArg = mockRepository.save.mock.calls[0][0];
      expect(savedArg.name).toBe('New Product');
      expect(savedArg.price).toBe(15.99);
      expect(savedArg.description).toBe('New product description');
    });
  });

  describe('delete', () => {
    it('should return true when product is successfully deleted', async () => {
      mockRepository.delete.mockResolvedValue(true);

      const result = await service.delete(1);

      expect(result).toBe(true);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should return false when product deletion fails', async () => {
      mockRepository.delete.mockResolvedValue(false);

      const result = await service.delete(999);

      expect(result).toBe(false);
      expect(mockRepository.delete).toHaveBeenCalledWith(999);
    });
  });
});