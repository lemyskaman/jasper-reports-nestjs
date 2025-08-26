import { Product } from '../src/products/domain/product.entity';

describe('Product Entity', () => {
  it('should create a valid product', () => {
    const product = new Product({
      id: 1,
      name: 'Test Product',
      price: 10.99,
      description: 'Test description',
    });

    expect(product.id).toBe(1);
    expect(product.name).toBe('Test Product');
    expect(product.price).toBe(10.99);
    expect(product.description).toBe('Test description');
  });

  it('should create a product without id', () => {
    const product = new Product({
      name: 'Test Product',
      price: 10.99,
    });

    expect(product.id).toBeUndefined();
    expect(product.name).toBe('Test Product');
    expect(product.price).toBe(10.99);
    expect(product.description).toBeUndefined();
  });

  it('should throw error for empty name', () => {
    expect(() => {
      new Product({
        name: '',
        price: 10.99,
      });
    }).toThrow('Product name cannot be empty');
  });

  it('should throw error for negative price', () => {
    expect(() => {
      new Product({
        name: 'Test Product',
        price: -1,
      });
    }).toThrow('Product price must be greater than zero');
  });

  it('should throw error for zero price', () => {
    expect(() => {
      new Product({
        name: 'Test Product',
        price: 0,
      });
    }).toThrow('Product price must be greater than zero');
  });

  it('should update name successfully', () => {
    const product = new Product({
      name: 'Test Product',
      price: 10.99,
    });

    product.updateName('Updated Product');
    expect(product.name).toBe('Updated Product');
  });

  it('should throw error when updating to empty name', () => {
    const product = new Product({
      name: 'Test Product',
      price: 10.99,
    });

    expect(() => {
      product.updateName('');
    }).toThrow('Product name cannot be empty');
  });

  it('should update price successfully', () => {
    const product = new Product({
      name: 'Test Product',
      price: 10.99,
    });

    product.updatePrice(15.99);
    expect(product.price).toBe(15.99);
  });

  it('should throw error when updating to negative price', () => {
    const product = new Product({
      name: 'Test Product',
      price: 10.99,
    });

    expect(() => {
      product.updatePrice(-5);
    }).toThrow('Product price must be greater than zero');
  });

  it('should update description successfully', () => {
    const product = new Product({
      name: 'Test Product',
      price: 10.99,
      description: 'Original description',
    });

    product.updateDescription('Updated description');
    expect(product.description).toBe('Updated description');
  });

  it('should allow setting description to undefined', () => {
    const product = new Product({
      name: 'Test Product',
      price: 10.99,
      description: 'Original description',
    });

    product.updateDescription(undefined);
    expect(product.description).toBeUndefined();
  });
});