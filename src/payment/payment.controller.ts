import {Controller, Post, Res, Body, UseGuards} from '@nestjs/common';
import {AuthGuard} from "../middleware/auth.guard";

@Controller()
@UseGuards(AuthGuard)
export class PaymentController {

    @Post()
    orderProcess(@Res() response, @Body() order): string {
        if (order.id) {
            const states = [
                'confirmed',
                'declined'
            ];
            return response.json({
                data: states[Math.floor(Math.random() * Math.floor(states.length))]
            });
        } else {
            return response.json({
                error: true
            });
        }

    }
}
