import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

describe('Products E2E', () => {
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

  it('should create a product', async () => {
    const dto = { name: 'Test Product', price: 42.5, description: 'desc' };
    const res = await request(app.getHttpServer())
      .post('/products')
      .send(dto)
      .expect(201);
    expect(res.body).toMatchObject(dto);
  });

  it('should get all products', async () => {
    const res = await request(app.getHttpServer())
      .get('/products')
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('name');
    expect(res.body[0]).toHaveProperty('price');
  });
});
