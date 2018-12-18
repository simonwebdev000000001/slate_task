import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from './payment.controller';

describe('PaymentController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [],
    }).compile();
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      const appController = app.get<PaymentController>(PaymentController);
      expect(appController.orderProcess()).toBe('Hello World!');
    });
  });
});
