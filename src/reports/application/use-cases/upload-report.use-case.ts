import { Injectable, Inject } from '@nestjs/common';
import { Report } from '../../domain/report.entity';
import { ReportRepositoryPort } from '../../domain/report.repository.port';
import { ReportDto } from '../dtos/report.dto';
import { StorageService } from '../../../shared/infrastructure/storage/storage.service';

@Injectable()
export class ReportsService {
  constructor(
    @Inject('ReportRepositoryPort')
    private readonly reportRepo: ReportRepositoryPort,
    private readonly storageService: StorageService,
  ) {}

  /**
   * Save a report file
   * @param file The uploaded file
   * @returns Promise resolving to a ReportDto
   */
  async saveReportFile(file: Express.Multer.File): Promise<ReportDto> {
    // Create a domain entity
    const report = new Report({
      filename: file.filename,
      originalname: file.originalname,
    });

    // Save to repository
    const savedReport = await this.reportRepo.save(report);
    
    // Return DTO
    return this.toDto(savedReport);
  }

  /**
   * List all reports
   * @returns Promise resolving to an array of ReportDto
   */
  async listReports(): Promise<ReportDto[]> {
    const reports = await this.reportRepo.findAll();
    return reports.map(this.toDto);
  }

  /**
   * Get a report by ID
   * @param id The ID of the report to find
   * @returns Promise resolving to a ReportDto or null if not found
   */
  async findById(id: number): Promise<ReportDto | null> {
    const report = await this.reportRepo.findById(id);
    return report ? this.toDto(report) : null;
  }

  /**
   * Delete a report
   * @param id The ID of the report to delete
   * @returns Promise resolving to a boolean indicating success
   */
  async deleteReport(id: number): Promise<boolean> {
    return this.reportRepo.delete(id);
  }

  /**
   * Map a domain entity to a DTO
   * @param report The Report domain entity
   * @returns The ReportDto
   */
  private toDto(report: Report): ReportDto {
    return {
      id: report.id,
      filename: report.filename,
      originalname: report.originalname,
      uploadedAt: report.uploadedAt,
    };
  }
}
