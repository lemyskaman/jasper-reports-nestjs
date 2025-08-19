import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { seedProducts } from './seed-products';
import { ProductOrmEntity } from '../../../../products/infrastructure/entities/product.orm-entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || process.env.DB_PORT || '5432', 10),
  username: process.env.DATABASE_USER || process.env.DB_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || process.env.DB_PASSWORD || 'password',
  database: process.env.DATABASE_NAME || process.env.DB_NAME || 'jasper_reports_db',
  entities: [ProductOrmEntity],
  synchronize: true,
});

AppDataSource.initialize()
  .then(async () => {
    await seedProducts(AppDataSource);
    console.log('Seeding complete');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Seeding error:', err);
    process.exit(1);
  });
