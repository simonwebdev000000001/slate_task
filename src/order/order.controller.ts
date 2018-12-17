import {Controller, Get, Post, Body, Res,Req} from '@nestjs/common';
import {CreateOrderDto} from './dto/create-order.dto';
import {OrderService} from './order.service';
import {Order} from './interfaces/order.interface';

@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) {
    }

    @Post()
    async create(@Res() response,@Req() req,@Body() createCatDto: CreateOrderDto) {
        await this.orderService.create(createCatDto);
        response.redirect(req.originalUrl)

    }

    @Get()
    async findAll(@Res() response): Promise<void> {
        this.orderService.findAll().then((orders) => {
            let tbody = '';
            orders.forEach((order) => {
                tbody += `
                        <tr>
                            <td>${order.name}</td>
                        </tr>
`;
            });
            response.writeHeader(200, {"Content-Type": "text/html"});
            response.write(`
                <table>
                  <thead>
                    <tr>
                        <th>Name</th>
                        <th>State</th>
                    </tr>
                  </thead>
                  <tbody>
                  ${tbody}
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
            response.end();
        });
    }
}