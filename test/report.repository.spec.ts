jest.mock('typeorm', () => ({ Repository: jest.fn() }));
jest.mock('../src/reports/infrastructure/entities/report.orm-entity', () => ({ ReportOrmEntity: class {} }));

describe('ReportRepository', () => {
  let repo: any;
  let mockRepo: any;

  beforeEach(() => {
    const { ReportRepositoryBase } = require('../src/reports/infrastructure/repositories/report.repository.base');
    mockRepo = { save: jest.fn() };
    repo = new ReportRepositoryBase(mockRepo);
  });

  it('should save a report', async () => {
    const report = { id: 1 };
    mockRepo.save.mockResolvedValue(report);
    const result = await repo.save(report);
    expect(result).toBe(report);
    expect(mockRepo.save).toHaveBeenCalledWith(report);
  });
});
