import { JasperService } from '../src/shared/infrastructure/jasper/jasper.service';
import { ConfigService } from '@nestjs/config';
import { StorageService } from '../src/shared/infrastructure/storage/storage.service';
import * as fs from 'fs';
import { Test } from '@nestjs/testing';

describe('JasperService', () => {
  let service: JasperService;
  let storageService: StorageService;
  let configService: ConfigService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        JasperService,
        StorageService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key, defaultValue) => {
              if (key === 'JASPER_ENGINE_DIR') return '/app/jasper-engine';
              if (key === 'UPLOAD_DIR') return './uploads';
              return defaultValue;
            }),
          },
        },
      ],
    }).compile();

    service = moduleRef.get<JasperService>(JasperService);
    storageService = moduleRef.get<StorageService>(StorageService);
    configService = moduleRef.get<ConfigService>(ConfigService);
  });

  it('should generate a PDF from a .jrxml file', async () => {
    const input = storageService.getUploadPath('sample.jrxml');
    const output = storageService.getUploadPath('sample.pdf');
    if (!fs.existsSync(input)) return; // skip if no sample
    await service.generatePdf(input, output, { TEST_PARAM: 'Hello' });
    expect(fs.existsSync(output)).toBe(true);
    fs.unlinkSync(output);
  });
});
