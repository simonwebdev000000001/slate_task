import {Test} from '@nestjs/testing';
import {INestApplication, Injectable} from '@nestjs/common';

var assert = require("assert")
import * as request from 'supertest';
import {OrderController} from './order.controller';
import {OrderModule} from './order.module';
import {OrderService} from "./order.service";


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
                .send({name: 'test'})
                .expect(302);
        });
    });
});

@Injectable()
class OrderServiceMock {
    async findAll(): Promise<any> {
        return [];
    }

    async updateState(): Promise<any> {
        return {};
    }
}


describe('Order', () => {
    let app: INestApplication;
    let orderService = {
        findAll: () => ['test'],
        create: (el) => el
    };

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [OrderModule],
        })
            .overrideProvider(OrderService)
            .useValue(orderService)
            .compile();

        app = module.createNestApplication();
        await app.init();
    });

    describe('findAllItems()', () => {
        it(`/GET orderes`, () => {
            return request(app.getHttpServer())
                .get('/orders/findAllItems')
                .expect(200)
                .expect(orderService.findAll());
        });
    });

    describe('findAll()', () => {
        it(`/GET orderes contet`, () => {
            return request(app.getHttpServer())
                .get('/orders')
                .expect(200)
                .expect('Content-Type', /html/);
        });
    });
    describe('create()', () => {
        it(`/Post order`, () => {
            let item = {name: 'Test order'};
            return request(app.getHttpServer())
                .post('/orders')
                .send(item)
                .expect(302)
                .expect('Location', '/orders')
        });
    });

    afterAll(async () => {
        await app.close();
    });
});


describe('OrderController', () => {
    let orderController: OrderController;
    let orderService: OrderService;

    const response = {
        writeHeader: (body?: any) => body,
        write: function (body?: string) {
            if (!this.result) this.result = '';
            this.result += body;
        },
        end: function () {
            return this.result
        },
        send: (body?: any) => body
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [OrderController],
            components: [{
                provide: OrderService,
                useValue: new OrderServiceMock()
            }],
        }).compile();

        orderService = module.get<OrderService>(OrderService);
        orderController = module.get<OrderController>(OrderController);
    });

    describe('findAllItems()', () => {
        it('should return an array of orders', async () => {
            const result = [
                {
                    _id: '1',
                }
            ];
            jest.spyOn(orderService, 'findAll').mockImplementation(() => result);

            expect(await orderController.findAllItems(response)).toBe(result);
        });
    });

    describe('findAll()', () => {
        it('should return an html contect with order in body', async () => {
            const result = [
                {
                    _id: '1',
                    name: 'Test order'
                }
            ];
            jest.spyOn(orderService, 'findAll').mockImplementation(() => result);

            expect(async () => [await orderController.findAll(response)]).toEqual(
                expect.arrayContaining(expect.stringMatching(`<td>${result[0].name}</td>`)));
        });
    });

    describe('cancel()', () => {
        it('should return an html content with updated order in canceled state ', async () => {
            const item = {
                _id: '1',
                name: 'Test order',
                state: 'created'
            };
            jest.spyOn(orderService, 'updateState').mockImplementation(() => item);

            let res = await orderController.cancel(response, item);
            console.log(res);
            expect(async () => [res]).toEqual(
                expect.arrayContaining(expect.stringMatching(`<td>created</td>`)));
        });
    });
});