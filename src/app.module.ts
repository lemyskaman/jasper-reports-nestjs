import { Module } from '@nestjs/common';
import { DatabaseModule } from './shared/infrastructure/database/database.module';
import { ProductsModule } from './products/products.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [DatabaseModule, ProductsModule, ReportsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
