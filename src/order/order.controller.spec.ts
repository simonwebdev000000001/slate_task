import { Test } from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';

import * as request from 'supertest';
import { OrderController } from './order.controller';
import { OrderModule } from './order.module';


function createTestModule() {
  return Test.createTestingModule({
    imports: [OrderModule],
    providers: [],
  }).compile();
}



  describe('OrderController', () => {
    let app: INestApplication;

    beforeAll(async () => {
      app = (await createTestModule()).createNestApplication();

      await app.init();
    });

    describe('GET orders', () => {
      it('should return "200"', () => {
        return request(app.getHttpServer())
            .get('/orders')
            .expect(200);
      });
    });
    describe('POST create order', () => {
      it('should return "302"', () => {
        return request(app.getHttpServer())
            .post('/orders')
            .send({name:'test'})
            .expect(302);
      });
    });
  });
