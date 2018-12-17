import { NestFactory } from '@nestjs/core';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/app.module';

async function bootstrap() {
  const order = await NestFactory.create(OrderModule);
  await order.listen(3000);

  const payment = await NestFactory.create(PaymentModule);
  await payment.listen(3001);
}
bootstrap();
