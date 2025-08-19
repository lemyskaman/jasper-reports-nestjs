import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadReportDto {
  @ApiProperty({ example: 'report1.jasper' })
  @IsString()
  filename!: string;

  @ApiProperty({ example: 'original-report1.jasper' })
  @IsString()
  originalname!: string;
}
