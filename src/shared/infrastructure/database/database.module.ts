import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductOrmEntity } from '../../../products/infrastructure/entities/product.orm-entity';
import { ReportOrmEntity } from '../../../reports/infrastructure/entities/report.orm-entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST', 'localhost'),
        port: configService.get('DATABASE_PORT', 5432),
        username: configService.get('DATABASE_USER', 'postgres'),
        password: configService.get('DATABASE_PASSWORD', 'password'),
        database: configService.get('DATABASE_NAME', 'jasper_reports_db'),
        entities: [ProductOrmEntity, ReportOrmEntity],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([ProductOrmEntity, ReportOrmEntity]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
