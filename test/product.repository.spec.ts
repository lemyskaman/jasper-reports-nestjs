
jest.mock('typeorm', () => ({ Repository: jest.fn() }));
jest.mock('../src/products/infrastructure/entities/product.orm-entity', () => ({ ProductOrmEntity: class {} }));

describe('ProductRepository', () => {
  let repo: any;
  let mockRepo: any;

  beforeEach(() => {
    const { ProductRepositoryBase } = require('../src/products/infrastructure/repositories/product.repository.base');
    mockRepo = { save: jest.fn(), find: jest.fn() };
    repo = new ProductRepositoryBase(mockRepo);
  });

  it('should save a product', async () => {
    const product = { name: 'Test' };
    mockRepo.save.mockResolvedValue(product);
    const result = await repo.save(product);
    expect(result).toBe(product);
    expect(mockRepo.save).toHaveBeenCalledWith(product);
  });

  it('should find all products', async () => {
    const products = [{ name: 'A' }, { name: 'B' }];
    mockRepo.find.mockResolvedValue(products);
    const result = await repo.findAll();
    expect(result).toBe(products);
    expect(mockRepo.find).toHaveBeenCalled();
  });
});
