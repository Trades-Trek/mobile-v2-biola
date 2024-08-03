import {Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import {OrdersService} from './orders.service';
import {CreateOrderDto} from './dto/create-order.dto';
import {UpdateOrderDto} from './dto/update-order.dto';
import {Types} from "mongoose";
import {AuthUser} from "../decorators/user.decorator";
import {UserDocument} from "../users/schemas/user.schema";
import {Public} from "../decorators/public-endpoint.decorator";

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {
    }

    @Post(':stock_symbol')
    create(@Param('stock_symbol') stockSymbol: string, @Body() createOrderDto: CreateOrderDto, @AuthUser() user:UserDocument) {
        return this.ordersService.create(stockSymbol,createOrderDto, user);
    }

    @Get()
    findAll() {
        // return this.ordersService.findAll();
    }
    @Public()
    @Get('test')
    test(){
        console.log('test')
        // return this.ordersService.addCronJob('test', '2')
    }


}