import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as fs from 'fs';

describe('Reports E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should list all reports', async () => {
    const res = await request(app.getHttpServer())
      .get('/reports')
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('filename');
      expect(res.body[0]).toHaveProperty('originalname');
    }
  });

  it('should upload and process a report', async () => {
    const samplePath = './uploads/sample.jrxml';
    if (!fs.existsSync(samplePath)) return;
    // Upload
    await request(app.getHttpServer())
      .post('/reports/upload')
      .attach('file', samplePath)
      .field('name', 'Sample Report')
      .expect(201);
    // Process
    const res = await request(app.getHttpServer())
      .post('/reports/process/sample.jrxml')
      .send({ TEST_PARAM: 'Hello' })
      .expect(200);
    expect(res.headers['content-type']).toBe('application/pdf');
    expect(res.body).toBeDefined();
  });

  it('should list all reports', async () => {
    const res = await request(app.getHttpServer())
      .get('/reports')
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('filename');
      expect(res.body[0]).toHaveProperty('originalname');
    }
  });
});
