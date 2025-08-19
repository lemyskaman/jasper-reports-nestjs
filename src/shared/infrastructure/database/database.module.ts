import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOrmEntity } from '../../../products/infrastructure/entities/product.orm-entity';
import { ReportOrmEntity } from '../../../reports/infrastructure/entities/report.orm-entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DATABASE_HOST || process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || process.env.DB_PORT || '5432', 10),
  username: process.env.DATABASE_USER || process.env.DB_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || process.env.DB_PASSWORD || 'password',
  database: process.env.DATABASE_NAME || process.env.DB_NAME || 'jasper_reports_db',
  entities: [ProductOrmEntity, ReportOrmEntity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([ProductOrmEntity, ReportOrmEntity]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
