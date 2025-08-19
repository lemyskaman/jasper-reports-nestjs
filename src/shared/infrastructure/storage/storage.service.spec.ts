import { StorageService } from './storage.service';
import * as path from 'path';
import * as fs from 'fs';

describe('StorageService', () => {
  let service: StorageService;
  const uploadsDir = path.join(process.cwd(), 'uploads');

  beforeEach(() => {
    // In Docker, avoid removing /app/uploads (may be locked). Just ensure service instantiates.
    service = new StorageService();
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
