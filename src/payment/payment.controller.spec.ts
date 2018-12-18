import {Test} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import {APP_GUARD} from '@nestjs/core';
import * as request from 'supertest';
import {PaymentController} from './payment.controller';
import {PaymentModule} from './payment.module';
import {AuthGuard} from '../middleware/auth.guard';
import {Config} from '../config';

var expect = require('chai').expect;


function createTestModule(guard) {
    return Test.createTestingModule({
        imports: [PaymentModule],
        providers: [
            {
                provide: APP_GUARD,
                useValue: guard,
            },
        ],
    }).compile();
}

describe('PaymentController', () => {
    let app: INestApplication;

    beforeAll(async () => {
        app = (await createTestModule(
            new AuthGuard(),
        )).createNestApplication();

        await app.init();
    });

    describe('POST payment without Authorization', () => {
        it('should return "403"', () => {
            return request(app.getHttpServer())
                .post('/')
                .expect(403);
        });
    });

    describe('POST payment with Authorization', () => {

        it('should return "200" with error', () => {
            return request(app.getHttpServer())
                .post('/')
                .set('Authorization', Config.USER_TOKEN)
                .expect(200, {error: true})
        });
    });

    describe('POST payment with Authorization and order details', () => {

        it('should return "200" with order state', (done) => {
            return request(app.getHttpServer())
                .post('/')
                .set('Authorization', Config.USER_TOKEN)
                .send({id: '1'})
                .expect(200)
                .expect(function ( res) {
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('data');
                })
                .end(done);
        });
    });
});
