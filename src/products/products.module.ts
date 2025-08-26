import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './application/controllers/products.controller';
import { ProductRepository } from './infrastructure/repositories/product.repository';
import { ProductOrmEntity } from './infrastructure/entities/product.orm-entity';
import { ProductService } from './application/use-cases/product.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductOrmEntity])],
  controllers: [ProductsController],
  providers: [
    ProductService,
    {
      provide: 'ProductRepositoryPort',
      useClass: ProductRepository,
    },
  ],
  exports: [ProductService],
})
export class ProductsModule {}
