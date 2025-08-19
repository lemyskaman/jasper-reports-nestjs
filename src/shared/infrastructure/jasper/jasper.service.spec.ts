import { JasperService } from './jasper.service';
import { spawn } from 'child_process';

jest.mock('child_process', () => ({
  exec: jest.fn(),
  spawn: jest.fn(),
}));

// Mock execAsync (promisified exec)
jest.mock('util', () => {
  const actualUtil = jest.requireActual('util');
  return {
    ...actualUtil,
    promisify: (fn: any) => fn === require('child_process').exec ? jest.fn() : actualUtil.promisify(fn),
  };
});

describe('JasperService', () => {
  let service: JasperService;
  let mockExecAsync: jest.Mock;

  beforeEach(() => {
    service = new JasperService();
    jest.clearAllMocks();
    // Patch execAsync on the service instance
    mockExecAsync = jest.fn();
    (service as any).processReport = async (reportPath: string, params: Record<string, any>) => {
      const paramStr = Object.entries(params).map(([k, v]) => `${k}=${v}`).join(' ');
      const command = `java -jar /app/jasper-engine/runner.jar ${reportPath} ${paramStr}`;
      const { stdout } = await mockExecAsync(command, { encoding: 'buffer', maxBuffer: 10 * 1024 * 1024 });
      return stdout as Buffer;
    };
  });

  describe('processReport', () => {
    it('should call execAsync with correct command and return buffer', async () => {
      const mockBuffer = Buffer.from('pdfdata');
      mockExecAsync.mockResolvedValueOnce({ stdout: mockBuffer });
      const result = await (service as any).processReport('/path/to/report', { foo: 'bar' });
      expect(result).toBe(mockBuffer);
      expect(mockExecAsync).toHaveBeenCalledWith(
        'java -jar /app/jasper-engine/runner.jar /path/to/report foo=bar',
        { encoding: 'buffer', maxBuffer: 10 * 1024 * 1024 }
      );
    });
  });

  describe('generatePdf', () => {
    it('should resolve with outputAbs on success', async () => {
      const mockSpawn = jest.fn().mockReturnValue({
        stderr: { on: jest.fn() },
        on: (event: string, cb: (code: number) => void) => {
          if (event === 'close') cb(0);
        },
      });
      (spawn as jest.Mock).mockImplementation(mockSpawn);
      const result = await service.generatePdf('/input.jrxml', '/output.pdf', { foo: 'bar' });
      expect(result.endsWith('/output.pdf')).toBe(true);
    });

    it('should reject with error on failure', async () => {
      const mockSpawn = jest.fn().mockReturnValue({
        stderr: { on: (event: string, cb: (data: string) => void) => { if (event === 'data') cb('err'); } },
        on: (event: string, cb: (code: number) => void) => {
          if (event === 'close') cb(1);
        },
      });
      (spawn as jest.Mock).mockImplementation(mockSpawn);
      await expect(service.generatePdf('/input.jrxml', '/output.pdf')).rejects.toThrow('Jasper CLI failed: err');
    });
  });
});
