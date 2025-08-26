import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportOrmEntity } from '../entities/report.orm-entity';
import { Report } from '../../domain/report.entity';
import { ReportRepositoryPort } from '../../domain/report.repository.port';

@Injectable()
export class ReportRepository implements ReportRepositoryPort {
  constructor(
    @InjectRepository(ReportOrmEntity)
    private readonly repo: Repository<ReportOrmEntity>,
  ) {}

  async findAll(): Promise<Report[]> {
    const ormEntities = await this.repo.find();
    return ormEntities.map(this.toDomainEntity);
  }

  async findById(id: number): Promise<Report | null> {
    const ormEntity = await this.repo.findOne({ where: { id } });
    return ormEntity ? this.toDomainEntity(ormEntity) : null;
  }

  async save(report: Report): Promise<Report> {
    const ormEntity = this.toOrmEntity(report);
    const savedEntity = await this.repo.save(ormEntity);
    return this.toDomainEntity(savedEntity);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  // Mapper methods
  private toDomainEntity(ormEntity: ReportOrmEntity): Report {
    return new Report({
      id: ormEntity.id,
      filename: ormEntity.filename,
      originalname: ormEntity.originalname,
      uploadedAt: ormEntity.uploadedAt,
    });
  }

  private toOrmEntity(domainEntity: Report): ReportOrmEntity {
    const ormEntity = new ReportOrmEntity();
    
    // Only set ID if it exists in the domain entity
    if (domainEntity.id) {
      ormEntity.id = domainEntity.id;
    }
    
    ormEntity.filename = domainEntity.filename;
    ormEntity.originalname = domainEntity.originalname;
    ormEntity.uploadedAt = domainEntity.uploadedAt;
    
    return ormEntity;
  }
}
