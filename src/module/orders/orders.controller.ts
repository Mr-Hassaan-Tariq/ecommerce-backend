import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Request, Response } from 'express';
import { json } from 'stream/consumers';
import { ResponsesService } from '../responses/responses.service';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService, private readonly responseService: ResponsesService) { }

    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post('/')
    async create(@Body() body: OrderDto, @Req() req: Request, @Res() res: Response) {
        const data = body.order
        const result = await this.ordersService.create(data)
        res.status(result.status).json(this.responseService.apiResponse(result))
    }

    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post('/delete')
    async deleteOrder(@Body() body: OrderDto, @Req() req: Request, @Res() res: Response) {
        const data = body.order
        const result = await this.ordersService.updateOrder(data)
        res.status(200).json(null)
    }

}
