import {Controller, Get, Res } from '@nestjs/common';

@Controller('*')
export class NotFoundController {

    @Get()
    async findAll(@Res() response): Promise<void> {
        response.redirect('/orders')
    }
}