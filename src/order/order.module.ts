import { Module ,MiddlewareConsumer,NestModule} from '@nestjs/common';
import {DatabaseModule} from '../database/database.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import {AccessMiddleware} from '../middleware/auth';

import { orderProviders } from './order.providers';

@Module({
  imports: [
    DatabaseModule
  ],
  controllers: [OrderController],
  providers: [OrderService,...orderProviders],
})
export class OrderModule  implements NestModule  {
  configure(consumer: MiddlewareConsumer) {
    consumer
        .apply(AccessMiddleware)
        .forRoutes('/');
  }
}
