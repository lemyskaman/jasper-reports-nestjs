import { Injectable } from '@nestjs/common';
import { StorageService } from '../../../shared/infrastructure/storage/storage.service';
import { ReportRepository } from '../../infrastructure/repositories/report.repository';

@Injectable()
export class ReportsService {
  constructor(
    private readonly storageService: StorageService,
    private readonly reportRepo: ReportRepository,
  ) {}

  async saveReportFile(file: Express.Multer.File) {
    // Save file info to DB if needed
    return { filename: file.filename, originalname: file.originalname };
  }
  async listReports() {
    return this.reportRepo.findAll();
  }
}
