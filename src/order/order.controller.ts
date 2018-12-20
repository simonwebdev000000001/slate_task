import {Controller, Get, Post, Put, Param, Body, Res, Req} from '@nestjs/common';
import {CreateOrderDto} from './dto/create-order.dto';
import {OrderService} from './order.service';
import {Order} from './interfaces/order.interface';
import {Config} from "../config"


@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) {
    }

    @Post()
    async create(@Res() response, @Req() req, @Body() createCatDto: CreateOrderDto) {
        await this.orderService.create(createCatDto);
        response.redirect(req.originalUrl)
    }

    @Post(':id/cancel')
    async cancel(@Res() response, @Param() params) {
        await this.orderService.updateState(params.id);
        response.redirect('/orders')
    }

    @Post(':id/status')
    async status(@Res() res, @Req() req, @Body() body: any, @Param() params) {
        return this.orderService.checkStatus(body.token, params).then(async (state) => {
            if (state) {
                await this.orderService.updateState(params.id, state);
                if (state === 'confirmed') {
                    setTimeout(() => {
                        this.orderService.updateState(params.id, 'delivered');
                    }, Config.TIME_OUT_TO_DELIVER)
                }
            }
            res.redirect('/orders')
        })
    }

    @Get('/findAllItems')
    async findAllItems(@Res() response): Promise<void> {
        return response.send(await this.orderService.findAll())
    }

    @Get()
    async findAll(@Res() response): Promise<void> {
        const orders = await this.orderService.findAll();

        response.writeHeader(200, {"Content-Type": "text/html"});
        response.write(`
                <style>
                    table {
                      font-family: arial, sans-serif;
                      border-collapse: collapse;
                      width: 100%;
                    }
                    
                    td, th {
                      border: 1px solid #dddddd;
                      text-align: left;
                      padding: 8px;
                    }
                    
                    tr:nth-child(even) {
                      background-color: #dddddd;
                    }
                </style>
                <table>
                  <thead>
                    <tr>
                        <th>Name</th>
                        <th>State</th>
                        <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                  ${this.createBody(orders)}
                   </tbody>
                </table>
                
                <h1>Add new order</h1>
                <form action="/orders" method="POST">
                  Order name:<br>
                  <input type="text" name="name" required>
                  <br> 
                  <input type="submit" value="Create">
                </form> 
    `);
        return response.end();
    }

    private createBody(orders): String {
        let tbody = '';
        orders.forEach((order: any) => {
            tbody += `
                        <tr>
                            <td>${order.name}</td>
                            <td>${order.state}</td>
                            ${order.state == 'created' ? (
                `
                                 <td>
                                    <form action="/orders/${order._id}/cancel" method="POST">
                                        <input type="hidden" value="${Config.USER_TOKEN}" name="token"/>
                                        <input type="submit" value="cancel">
                                    </form>
                                    <form action="/orders/${order._id}/status" method="POST">
                                        <input type="hidden" value="${Config.USER_TOKEN}" name="token"/>
                                        <input type="submit" value="check status">
                                    </form>
                                </td>
                                `
            ) : (' <td><button onclick="location.reload()">check status</button></td>')}
                            
                        </tr>
`;
        });
        return tbody;
    }
}