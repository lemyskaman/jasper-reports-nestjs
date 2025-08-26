import { StorageService } from './storage.service';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as path from 'path';
import * as fs from 'fs';

describe('StorageService', () => {
  let service: StorageService;
  let configService: ConfigService;
  let uploadsDir: string;

  beforeEach(async () => {
    // In Docker, avoid removing /app/uploads (may be locked). Just ensure service instantiates.
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StorageService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key, defaultValue) => {
              if (key === 'UPLOAD_DIR') return 'uploads';
              return defaultValue;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<StorageService>(StorageService);
    configService = module.get<ConfigService>(ConfigService);
    uploadsDir = path.join(process.cwd(), 'uploads');
  });

  afterAll(() => {
    // No cleanup needed in Docker
  });

  it('should create uploads directory if not exists', () => {
    expect(fs.existsSync(uploadsDir)).toBe(true);
  });

  it('should return correct upload path', () => {
    const filename = 'testfile.txt';
    const expected = path.join(uploadsDir, filename);
    expect(service.getUploadPath(filename)).toBe(expected);
  });
});
