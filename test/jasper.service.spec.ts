import { JasperService } from '../src/shared/infrastructure/jasper/jasper.service';
import * as fs from 'fs';

describe('JasperService', () => {
  let service: JasperService;
  beforeAll(() => {
    service = new JasperService();
  });

  it('should generate a PDF from a .jrxml file', async () => {
    const input = './uploads/sample.jrxml';
    const output = './uploads/sample.pdf';
    if (!fs.existsSync(input)) return; // skip if no sample
    await service.generatePdf(input, output, { TEST_PARAM: 'Hello' });
    expect(fs.existsSync(output)).toBe(true);
    fs.unlinkSync(output);
  });
});
