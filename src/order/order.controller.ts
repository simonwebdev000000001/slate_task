import {Controller, Get, Post, Put, Param, Body, Res, Req} from '@nestjs/common';
import {CreateOrderDto} from './dto/create-order.dto';
import {OrderService} from './order.service';
import {Order} from './interfaces/order.interface';
import {Config} from "../config"

var http = require('http');
var querystring = require('querystring');

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
    async cancel(@Res() response, @Req() req, @Param() params) {
        await this.orderService.updateState(params.id);
        response.redirect('/orders')
    }

    @Post(':id/status')
    async status(@Res() res, @Req() req, @Body() body:any,@Param() params) {
        const data = querystring.stringify(params);
        const options = {
            host: '127.0.0.1',
            port: 3001,
            path: '',
            method: 'POST',
            headers: {
                'Authorization': body.token,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        const httpreq = http.request(options, (response) => {
            response.setEncoding('utf8');
            let resultState;
            response.on('data', function (chunk) {
                resultState = JSON.parse(chunk);
                if(resultState.statusCode==403){
                    resultState = false;
                }else{
                    resultState = resultState.data;
                }
            });
            response.on('end', async () => {
                if (resultState) {
                    await this.orderService.updateState(params.id, resultState);
                    if (resultState === 'confirmed') {
                        setTimeout(() => {
                            this.orderService.updateState(params.id, 'delivered');
                        }, Config.TIME_OUT_TO_DELIVER)
                    }
                }
                res.redirect('/orders')
            })
        });
        httpreq.write(data);
        httpreq.end();
        return
    }

    @Get()
    async findAll(@Res() response): Promise<void> {
        this.orderService.findAll().then((orders) => {
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