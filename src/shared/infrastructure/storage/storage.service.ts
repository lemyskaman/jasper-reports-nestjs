import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

@Injectable()
export class StorageService {
  private uploadDir: string;

  constructor(private configService?: ConfigService) {
    this.uploadDir = this.configService?.get('UPLOAD_DIR', join(process.cwd(), 'uploads')) || join(process.cwd(), 'uploads');
    
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  getUploadPath(filename: string) {
    return join(this.uploadDir, filename);
  }
}
