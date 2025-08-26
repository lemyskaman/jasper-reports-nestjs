import { Report } from '../src/reports/domain/report.entity';

describe('Report Entity', () => {
  it('should create a valid report', () => {
    const report = new Report({
      id: 1,
      filename: 'test-report.jasper',
      originalname: 'original-report.jrxml',
      uploadedAt: new Date('2023-01-01'),
    });

    expect(report.id).toBe(1);
    expect(report.filename).toBe('test-report.jasper');
    expect(report.originalname).toBe('original-report.jrxml');
    expect(report.uploadedAt).toEqual(new Date('2023-01-01'));
  });

  it('should create a report without id and with default uploadedAt', () => {
    const beforeTest = new Date();
    const report = new Report({
      filename: 'test-report.jasper',
      originalname: 'original-report.jrxml',
    });
    const afterTest = new Date();

    expect(report.id).toBeUndefined();
    expect(report.filename).toBe('test-report.jasper');
    expect(report.originalname).toBe('original-report.jrxml');
    expect(report.uploadedAt.getTime()).toBeGreaterThanOrEqual(beforeTest.getTime());
    expect(report.uploadedAt.getTime()).toBeLessThanOrEqual(afterTest.getTime());
  });

  it('should throw error for empty filename', () => {
    expect(() => {
      new Report({
        filename: '',
        originalname: 'original-report.jrxml',
      });
    }).toThrow('Report filename cannot be empty');
  });

  it('should throw error for empty originalname', () => {
    expect(() => {
      new Report({
        filename: 'test-report.jasper',
        originalname: '',
      });
    }).toThrow('Report original name cannot be empty');
  });

  it('should update filename successfully', () => {
    const report = new Report({
      filename: 'test-report.jasper',
      originalname: 'original-report.jrxml',
    });

    report.updateFilename('updated-report.jasper');
    expect(report.filename).toBe('updated-report.jasper');
  });

  it('should throw error when updating to empty filename', () => {
    const report = new Report({
      filename: 'test-report.jasper',
      originalname: 'original-report.jrxml',
    });

    expect(() => {
      report.updateFilename('');
    }).toThrow('Report filename cannot be empty');
  });

  it('should update originalname successfully', () => {
    const report = new Report({
      filename: 'test-report.jasper',
      originalname: 'original-report.jrxml',
    });

    report.updateOriginalname('updated-original.jrxml');
    expect(report.originalname).toBe('updated-original.jrxml');
  });

  it('should throw error when updating to empty originalname', () => {
    const report = new Report({
      filename: 'test-report.jasper',
      originalname: 'original-report.jrxml',
    });

    expect(() => {
      report.updateOriginalname('');
    }).toThrow('Report original name cannot be empty');
  });
});