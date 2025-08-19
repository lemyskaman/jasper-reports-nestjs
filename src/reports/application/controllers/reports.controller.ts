import { Controller, Post, UseInterceptors, UploadedFile, Body, Param, Get, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ReportsService } from '../use-cases/upload-report.use-case';
import { UploadReportDto } from '../dtos/upload-report.dto';
import { JasperService } from '../../../shared/infrastructure/jasper/jasper.service';
import { Response } from 'express';

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly jasperService: JasperService,
  ) {}

  @Get()
  async listReports() {
    return this.reportsService.listReports();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (['.jrxml', '.jasper'].includes(extname(file.originalname))) {
        cb(null, true);
      } else {
        cb(new Error('Only .jrxml or .jasper files allowed'), false);
      }
    },
  }))
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
  async uploadReport(@UploadedFile() file: Express.Multer.File, @Body() uploadReportDto: UploadReportDto): Promise<UploadReportDto> {
    // Optionally merge file and DTO data
    const saved = await this.reportsService.saveReportFile({ ...uploadReportDto, ...file });
    return {
      filename: saved.filename,
      originalname: saved.originalname,
    };
  }

  @Post('process/:filename')
  async processReport(@Param('filename') filename: string, @Body() params: any, @Res() res: Response) {
    const reportPath = `./uploads/${filename}`;
    const outputPath = `./uploads/${filename}.pdf`;
    await this.jasperService.generatePdf(reportPath, outputPath, params);
    res.setHeader('Content-Type', 'application/pdf');
    res.download(outputPath);
  }
}
