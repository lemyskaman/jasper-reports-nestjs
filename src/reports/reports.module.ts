import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './application/controllers/reports.controller';
import { ReportsService } from './application/use-cases/upload-report.use-case';
import { ReportRepository } from './infrastructure/repositories/report.repository';
import { ReportOrmEntity } from './infrastructure/entities/report.orm-entity';
import { JasperService } from '../shared/infrastructure/jasper/jasper.service';
import { StorageService } from '../shared/infrastructure/storage/storage.service';

@Module({
  imports: [TypeOrmModule.forFeature([ReportOrmEntity])],
  controllers: [ReportsController],
  providers: [
    ReportsService,
    {
      provide: 'ReportRepositoryPort',
      useClass: ReportRepository,
    },
    ReportRepository,
    JasperService,
    StorageService,
  ],
  exports: [ReportsService],
})
export class ReportsModule {}
