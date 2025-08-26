import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from '../src/reports/application/controllers/reports.controller';
import { ReportsService } from '../src/reports/application/use-cases/upload-report.use-case';
import { JasperService } from '../src/shared/infrastructure/jasper/jasper.service';
import { StorageService } from '../src/shared/infrastructure/storage/storage.service';
import { ConfigService } from '@nestjs/config';
import { UploadReportDto } from '../src/reports/application/dtos/upload-report.dto';
import { Response } from 'express';

describe('ReportsController (NestJS)', () => {
  let controller: ReportsController;
  let reportsService: ReportsService;
  let jasperService: JasperService;
  let storageService: StorageService;
  let configService: ConfigService;

  beforeEach(async () => {
    const reportsServiceMock = { saveReportFile: jest.fn(), listReports: jest.fn(), findById: jest.fn() };
    const jasperServiceMock = { generatePdf: jest.fn() };
    const storageServiceMock = { 
      getUploadPath: jest.fn(filename => `/uploads/${filename}`)
    };
    const configServiceMock = {
      get: jest.fn((key, defaultValue) => {
        if (key === 'UPLOAD_DIR') return './uploads';
        return defaultValue;
      }),
    };
    
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        { provide: ReportsService, useValue: reportsServiceMock },
        { provide: JasperService, useValue: jasperServiceMock },
        { provide: StorageService, useValue: storageServiceMock },
        { provide: ConfigService, useValue: configServiceMock },
      ],
    }).compile();
    
    controller = module.get(ReportsController);
    reportsService = module.get(ReportsService);
    jasperService = module.get(JasperService);
    storageService = module.get(StorageService);
    configService = module.get(ConfigService);
  });
  it('should list all reports', async () => {
    const reports = [
      { filename: 'a.jasper', originalname: 'a.jrxml' },
      { filename: 'b.jasper', originalname: 'b.jrxml' },
    ];
    (reportsService.listReports as jest.Mock).mockResolvedValue(reports);
    const result = await controller.listReports();
    expect(result).toBe(reports);
    expect(reportsService.listReports).toHaveBeenCalled();
  });

  it('should upload a report', async () => {
    const file = { filename: 'f.jasper', originalname: 'f.jrxml' } as any;
    const dto: UploadReportDto = { filename: 'f.jasper', originalname: 'f.jrxml' };
    (reportsService.saveReportFile as jest.Mock).mockResolvedValue(dto);
    const result = await controller.uploadReport(file, dto);
    expect(result).toEqual(dto);
    expect(reportsService.saveReportFile).toHaveBeenCalledWith({ ...dto, ...file });
  });

  it('should process a report and send PDF', async () => {
    const filename = 'f.jasper';
    const params = { foo: 'bar' };
    const res = { setHeader: jest.fn(), download: jest.fn() } as any as Response;
    const reportPath = '/uploads/f.jasper';
    const outputPath = '/uploads/f.jasper.pdf';
    
    (storageService.getUploadPath as jest.Mock).mockReturnValueOnce(reportPath);
    (storageService.getUploadPath as jest.Mock).mockReturnValueOnce(outputPath);
    (jasperService.generatePdf as jest.Mock).mockResolvedValue(outputPath);
    
    await controller.processReport(filename, params, res);
    
    expect(storageService.getUploadPath).toHaveBeenCalledWith(filename);
    expect(storageService.getUploadPath).toHaveBeenCalledWith(`${filename}.pdf`);
    expect(jasperService.generatePdf).toHaveBeenCalledWith(reportPath, outputPath, params);
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf');
    expect(res.download).toHaveBeenCalledWith(outputPath);
  });
});
