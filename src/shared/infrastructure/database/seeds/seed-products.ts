
import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import { ProductOrmEntity } from '../../../../products/infrastructure/entities/product.orm-entity';

export async function seedProducts(dataSource: DataSource) {
  if (!dataSource) {
    throw new Error('DataSource instance required');
  }
  const repo = dataSource.getRepository(ProductOrmEntity);
  const products = Array.from({ length: 1000 }, () => repo.create({
    name: faker.commerce.productName(),
    price: parseFloat(faker.commerce.price()),
    description: faker.commerce.productDescription(),
  }));
  await repo.save(products);
  console.log('Seeded 1000+ products');
}
