import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReportRepository } from '../src/reports/infrastructure/repositories/report.repository';
import { ReportOrmEntity } from '../src/reports/infrastructure/entities/report.orm-entity';
import { Repository } from 'typeorm';

describe('ReportRepository (NestJS)', () => {
  let repo: ReportRepository;
  let dbMock: Partial<Record<keyof Repository<ReportOrmEntity>, jest.Mock>>;

  beforeEach(async () => {
    dbMock = {
      save: jest.fn(),
      find: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportRepository,
        {
          provide: getRepositoryToken(ReportOrmEntity),
          useValue: dbMock,
        },
      ],
    }).compile();
    repo = module.get(ReportRepository);
  });
  it('should find all reports', async () => {
    const reports = [
      { filename: 'a.jasper', originalname: 'a.jrxml' },
      { filename: 'b.jasper', originalname: 'b.jrxml' },
    ];
    dbMock.find!.mockResolvedValue(reports);
    const result = await repo.findAll();
    expect(result).toBe(reports);
    expect(dbMock.find).toHaveBeenCalled();
  });

  it('should save a report', async () => {
    const report: Partial<ReportOrmEntity> = {
      filename: 'file.jasper',
      originalname: 'file.jrxml',
    };
    dbMock.save!.mockResolvedValue(report);
    const result = await repo.save(report);
    expect(result).toBe(report);
    expect(dbMock.save).toHaveBeenCalledWith(report);
  });
});
