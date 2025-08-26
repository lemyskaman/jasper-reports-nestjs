import { ApiProperty } from '@nestjs/swagger';

/**
 * Report Data Transfer Object
 * Used for returning report data to clients
 */
export class ReportDto {
  @ApiProperty({ description: 'The unique identifier of the report' })
  id?: number;

  @ApiProperty({ description: 'The filename of the stored report' })
  filename!: string;

  @ApiProperty({ description: 'The original filename of the report' })
  originalname!: string;

  @ApiProperty({ description: 'The date when the report was uploaded' })
  uploadedAt!: Date;
}