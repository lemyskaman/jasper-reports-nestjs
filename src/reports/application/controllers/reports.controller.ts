import { Controller, Post, UseInterceptors, UploadedFile, Body, Param, Get, Res, UsePipes, ValidationPipe, NotFoundException, HttpStatus, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ConfigService } from '@nestjs/config';
import { ReportsService } from '../use-cases/upload-report.use-case';
import { UploadReportDto } from '../dtos/upload-report.dto';
import { ReportDto } from '../dtos/report.dto';
import { JasperService } from '../../../shared/infrastructure/jasper/jasper.service';
import { StorageService } from '../../../shared/infrastructure/storage/storage.service';
import { Response } from 'express';

function getMulterStorageConfig(configService: ConfigService) {
  return diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = configService?.get('UPLOAD_DIR', './uploads') ?? './uploads';
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
}

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly jasperService: JasperService,
    private readonly storageService: StorageService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all reports' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of all reports', type: [ReportDto] })
  async listReports(): Promise<ReportDto[]> {
    return this.reportsService.listReports();
  }

  @Post('upload')
  @ApiOperation({ summary: 'Upload a report file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'The report file to upload (.jrxml or .jasper)',
        },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Report uploaded successfully', type: ReportDto })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        // fallback for tests: use './uploads' if configService is not available
        cb(null, './uploads');
      },
      filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if ([".jrxml", ".jasper"].includes(extname(file.originalname))) {
        cb(null, true);
      } else {
        cb(new Error('Only .jrxml or .jasper files allowed'), false);
      }
    },
  }))
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
  async uploadReport(@UploadedFile() file: Express.Multer.File): Promise<ReportDto> {
    return this.reportsService.saveReportFile(file);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a report by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Report found', type: ReportDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Report not found' })
  async getReport(@Param('id') id: number): Promise<ReportDto> {
    const report = await this.reportsService.findById(id);
    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }
    return report;
  }

  @Post('process/:filename')
  @ApiOperation({ summary: 'Process a report and generate PDF' })
  @ApiResponse({ status: HttpStatus.OK, description: 'PDF generated successfully' })
  async processReport(@Param('filename') filename: string, @Body() params: any, @Res() res: Response) {
    const reportPath = this.storageService.getUploadPath(filename);
    const outputPath = this.storageService.getUploadPath(`${filename}.pdf`);
    await this.jasperService.generatePdf(reportPath, outputPath, params);
    res.setHeader('Content-Type', 'application/pdf');
    res.download(outputPath);
  }
}
