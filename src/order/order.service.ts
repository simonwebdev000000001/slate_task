import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { Order } from './interfaces/order.interface';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(@Inject('OrderModelToken') private readonly itemModel: Model<Order>) {}

  async create(createCatDto: CreateOrderDto): Promise<Order> {
    const createdCat = new this.itemModel(createCatDto);
    return await createdCat.save();
  }

  async findAll(): Promise<Order[]> {
    return await this.itemModel.find().exec();
  }

  getHello():string{
    return 'HELLO r';
  }
}