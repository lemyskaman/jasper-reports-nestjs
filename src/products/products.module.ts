import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './application/controllers/products.controller';
import { ProductRepository } from './infrastructure/repositories/product.repository';
import { ProductOrmEntity } from './infrastructure/entities/product.orm-entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductOrmEntity])],
  controllers: [ProductsController],
  providers: [ProductRepository],
  exports: [ProductRepository],
})
export class ProductsModule {}
