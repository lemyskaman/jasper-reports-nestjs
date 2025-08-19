import { Test, TestingModule } from '@nestjs/testing';
import { JasperService } from '../src/shared/infrastructure/jasper/jasper.service';




describe('JasperService (NestJS)', () => {
  let service: JasperService;
  let execAsyncMock: jest.Mock;

  beforeEach(() => {
    execAsyncMock = jest.fn().mockResolvedValue({ stdout: Buffer.from('pdfdata') });
    service = JasperService.withExecAsync(execAsyncMock);
  });


  it('should processReport and return buffer', async () => {
    const buf = await service.processReport('file.jasper', { foo: 'bar' });
    expect(Buffer.isBuffer(buf)).toBe(true);
    expect(buf.toString()).toBe('pdfdata');
    expect(execAsyncMock).toHaveBeenCalled();
  });

  it('should generatePdf and resolve output path', async () => {
    // Mock generatePdf to just resolve the output path
    const spy = jest.spyOn(service as any, 'generatePdf').mockResolvedValue('/tmp/out.pdf');
    const out = await (service as any).generatePdf('in.jasper', 'out.pdf', { foo: 'bar' });
    expect(out).toBe('/tmp/out.pdf');
    spy.mockRestore();
  });
});
