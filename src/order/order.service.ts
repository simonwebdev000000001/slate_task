import {Model} from 'mongoose';
import {Injectable, Inject} from '@nestjs/common';
import {Order} from './interfaces/order.interface';
import {CreateOrderDto} from './dto/create-order.dto';
import {Config} from "../config";

var http = require('http');
var querystring = require('querystring');

@Injectable()
export class OrderService {
    constructor(@Inject('OrderModelToken') private readonly itemModel: Model<Order>) {
    }

    async create(createCatDto: CreateOrderDto): Promise<Order> {
        const createdCat = new this.itemModel(createCatDto);
        return await createdCat.save();
    }

    async updateState(id: String, state: String = 'canceled'): Promise<Order> {
        return await this.itemModel.update({_id: id}, {$set: {state}}).exec();
    }

    async checkStatus(token: String, params: any): Promise<any> {
        const data = querystring.stringify(params);
        return new Promise((resolve => {
            const options = {
                host: '127.0.0.1',
                port: 3001,
                path: '',
                method: 'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(data)
                }
            };

            const httpreq = http.request(options, (response) => {
                response.setEncoding('utf8');
                let resultState;
                response.on('data', function (chunk) {
                    resultState = JSON.parse(chunk);
                    if (resultState.statusCode == 403) {
                        resultState = false;
                    } else {
                        resultState = resultState.data;
                    }
                });
                response.on('end', async () => {
                    resolve(resultState);
                })
            });
            httpreq.write(data);
            httpreq.end();
        }))
    }

    async findAll(): Promise<Order[]> {
        return await this.itemModel.find().exec();
    }
}