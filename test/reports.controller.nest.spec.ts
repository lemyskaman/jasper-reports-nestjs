import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from '../src/reports/application/controllers/reports.controller';
import { ReportsService } from '../src/reports/application/use-cases/upload-report.use-case';
import { JasperService } from '../src/shared/infrastructure/jasper/jasper.service';
import { UploadReportDto } from '../src/reports/application/dtos/upload-report.dto';
import { Response } from 'express';

describe('ReportsController (NestJS)', () => {
  let controller: ReportsController;
  let reportsService: ReportsService;
  let jasperService: JasperService;

  beforeEach(async () => {
    const reportsServiceMock = { saveReportFile: jest.fn(), listReports: jest.fn() };
    const jasperServiceMock = { generatePdf: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        { provide: ReportsService, useValue: reportsServiceMock },
        { provide: JasperService, useValue: jasperServiceMock },
      ],
    }).compile();
    controller = module.get(ReportsController);
    reportsService = module.get(ReportsService);
    jasperService = module.get(JasperService);
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
    (jasperService.generatePdf as jest.Mock).mockResolvedValue('/uploads/f.jasper.pdf');
    await controller.processReport(filename, params, res);
    expect(jasperService.generatePdf).toHaveBeenCalledWith('./uploads/f.jasper', './uploads/f.jasper.pdf', params);
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf');
    expect(res.download).toHaveBeenCalledWith('./uploads/f.jasper.pdf');
  });
});
