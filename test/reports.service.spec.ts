import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from '../src/reports/application/use-cases/upload-report.use-case';
import { Report } from '../src/reports/domain/report.entity';
import { ReportRepositoryPort } from '../src/reports/domain/report.repository.port';
import { StorageService } from '../src/shared/infrastructure/storage/storage.service';

describe('ReportsService', () => {
  let service: ReportsService;
  let mockRepository: jest.Mocked<ReportRepositoryPort>;
  let mockStorageService: jest.Mocked<StorageService>;

  beforeEach(async () => {
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    mockStorageService = {
      storeFile: jest.fn(),
      getFilePath: jest.fn(),
      deleteFile: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: 'ReportRepositoryPort',
          useValue: mockRepository,
        },
        {
          provide: StorageService,
          useValue: mockStorageService,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('listReports', () => {
    it('should return an array of report DTOs', async () => {
      const reports = [
        new Report({
          id: 1,
          filename: 'report1.jasper',
          originalname: 'original1.jrxml',
          uploadedAt: new Date('2023-01-01'),
        }),
        new Report({
          id: 2,
          filename: 'report2.jasper',
          originalname: 'original2.jrxml',
          uploadedAt: new Date('2023-01-02'),
        }),
      ];
      mockRepository.findAll.mockResolvedValue(reports);

      const result = await service.listReports();

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[0].filename).toBe('report1.jasper');
      expect(result[0].originalname).toBe('original1.jrxml');
      expect(result[0].uploadedAt).toEqual(new Date('2023-01-01'));
      expect(result[1].id).toBe(2);
      expect(result[1].filename).toBe('report2.jasper');
      expect(result[1].originalname).toBe('original2.jrxml');
      expect(result[1].uploadedAt).toEqual(new Date('2023-01-02'));
      expect(mockRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a report DTO when report exists', async () => {
      const report = new Report({
        id: 1,
        filename: 'report1.jasper',
        originalname: 'original1.jrxml',
        uploadedAt: new Date('2023-01-01'),
      });
      mockRepository.findById.mockResolvedValue(report);

      const result = await service.findById(1);

      expect(result).toBeDefined();
      expect(result?.id).toBe(1);
      expect(result?.filename).toBe('report1.jasper');
      expect(result?.originalname).toBe('original1.jrxml');
      expect(result?.uploadedAt).toEqual(new Date('2023-01-01'));
      expect(mockRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should return null when report does not exist', async () => {
      mockRepository.findById.mockResolvedValue(null);

      const result = await service.findById(999);

      expect(result).toBeNull();
      expect(mockRepository.findById).toHaveBeenCalledWith(999);
    });
  });

  describe('saveReportFile', () => {
    it('should save and return a report DTO', async () => {
      const mockFile = {
        filename: 'uploaded-report.jasper',
        originalname: 'original-report.jrxml',
      } as Express.Multer.File;

      const savedReport = new Report({
        id: 1,
        filename: mockFile.filename,
        originalname: mockFile.originalname,
        uploadedAt: new Date('2023-01-01'),
      });

      mockRepository.save.mockResolvedValue(savedReport);

      const result = await service.saveReportFile(mockFile);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.filename).toBe('uploaded-report.jasper');
      expect(result.originalname).toBe('original-report.jrxml');
      expect(result.uploadedAt).toEqual(new Date('2023-01-01'));
      expect(mockRepository.save).toHaveBeenCalled();
      const savedArg = mockRepository.save.mock.calls[0][0];
      expect(savedArg.filename).toBe('uploaded-report.jasper');
      expect(savedArg.originalname).toBe('original-report.jrxml');
    });
  });

  describe('deleteReport', () => {
    it('should return true when report is successfully deleted', async () => {
      mockRepository.delete.mockResolvedValue(true);

      const result = await service.deleteReport(1);

      expect(result).toBe(true);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should return false when report deletion fails', async () => {
      mockRepository.delete.mockResolvedValue(false);

      const result = await service.deleteReport(999);

      expect(result).toBe(false);
      expect(mockRepository.delete).toHaveBeenCalledWith(999);
    });
  });
});