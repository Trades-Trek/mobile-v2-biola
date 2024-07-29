import {Controller, Get, Post, Body, Patch, Param, Delete, Query, Inject, forwardRef} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {CreateCompetitionDto} from "../../competitions/dto/create-competition.dto";
import {AuthUser} from "../../decorators/user.decorator";
import {UserDocument} from "../../users/schemas/user.schema";
import {CompetitionsService} from "../../competitions/services/competitions.service";
import {Types} from "mongoose";
import {GetPagination} from "../../decorators/pagination.decorator";
import {Pagination} from "../../enums/pagination.enum";
import {OrderQueryDto} from "../../orders/dto/create-order.dto";
import {successResponse} from "../../utils/response";
import {OrdersService} from "../../orders/orders.service";

@ApiTags('Admin')
@Controller('admin/competitions')
export class AdminCompetitionsController {
    constructor(private competitionService: CompetitionsService, private orderService: OrdersService,) {
    }

    @Post()
    create(@Body() createCompetitionDto: CreateCompetitionDto, @AuthUser() user: UserDocument) {
        createCompetitionDto.is_default = 1;
        return this.competitionService.create(user, createCompetitionDto);
    }

    @Get()
    getAllCompetitions(@GetPagination() pagination: Pagination) {
        return this.competitionService.getAllCompetitions(pagination)
    }

    @Get('/participants/:competition_id')
    getParticipants(@Param('competition_id') competitionId: Types.ObjectId) {
        return this.competitionService.getParticipants(competitionId, true)
    }

    @Get('/orders/:competition_id')
    async getCompOrders(@Query() query: OrderQueryDto, @Param('competition_id') competitionId: Types.ObjectId, @GetPagination() pagination: Pagination) {
        return successResponse(await this.orderService.getOrders({competition_id: competitionId, ...query}, pagination))
    }

    @Delete('orders/:order_id')
    async deleteOrder(@Param('order_id') orderId: Types.ObjectId, @AuthUser() user: UserDocument) {
        return this.orderService.deleteOrder(orderId, user)
    }


    @Post('reset-portfolio/:competition_id')
    resetPortfolio(@AuthUser() user: UserDocument, @Param('competition_id') competitionId: Types.ObjectId) {
        return this.competitionService.resetPortfolio(competitionId, user)
    }


    @Delete(':competition_id')
    remove(@Param('competition_id') competitionId: Types.ObjectId, @AuthUser() user: UserDocument) {
        return this.competitionService.remove(competitionId, user, true);
    }
}
