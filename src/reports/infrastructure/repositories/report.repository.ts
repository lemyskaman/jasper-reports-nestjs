import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportOrmEntity } from '../entities/report.orm-entity';

@Injectable()
export class ReportRepository {
  constructor(
    @InjectRepository(ReportOrmEntity)
    private readonly repo: Repository<ReportOrmEntity>,
  ) {}

  async save(report: Partial<ReportOrmEntity>) {
    return this.repo.save(report);
  }

  async findAll(): Promise<ReportOrmEntity[]> {
    return this.repo.find();
  }
}
