import { Module ,MiddlewareConsumer,NestModule} from '@nestjs/common';
import {DatabaseModule} from '../database/database.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import {AccessMiddleware} from '../middleware/access';

import { orderProviders } from './order.providers';
import {NotFoundController} from "../not_found/not.found.controller";

@Module({
  imports: [
    DatabaseModule
  ],
  controllers: [
      OrderController,
      NotFoundController
  ],
  providers: [OrderService,...orderProviders],
})
export class OrderModule  implements NestModule  {
  configure(consumer: MiddlewareConsumer) {
    consumer
        .apply(AccessMiddleware)
        .forRoutes('/');
  }
}
