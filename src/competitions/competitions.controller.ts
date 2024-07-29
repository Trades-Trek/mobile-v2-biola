import {Body, Controller, Delete, forwardRef, Get, Inject, Param, Post, Query} from '@nestjs/common';
import {CompetitionsService} from './services/competitions.service';
import {CreateCompetitionDto, JoinCompetitionDto, PortfolioDto} from './dto/create-competition.dto';
import {AuthUser} from "../decorators/user.decorator";
import {UserDocument} from "../users/schemas/user.schema";
import {GetPagination} from "../decorators/pagination.decorator";
import {Pagination} from "../enums/pagination.enum";
import {Types} from "mongoose";
import {ApiTags} from "@nestjs/swagger";
import {returnErrorResponse, successResponse} from "../utils/response";
import {COMPETITION_ENTRY} from "../enums/competition.enum";
import {Public} from "../decorators/public-endpoint.decorator";
import {OrderQueryDto} from "../orders/dto/create-order.dto";
import {OrdersService} from "../orders/orders.service";

@ApiTags('Competitions')
@Controller('competitions')
export class CompetitionsController {
    constructor(private readonly competitionsService: CompetitionsService, @Inject(forwardRef(() => OrdersService)) private orderService: OrdersService) {
    }
    @Post()
    create(@Body() createCompetitionDto: CreateCompetitionDto, @AuthUser() user: UserDocument) {
        return this.competitionsService.create(user, createCompetitionDto);
    }

    @Post('join/:competition_id')
    join(@AuthUser() user: UserDocument, @Param('competition_id') competitionId: Types.ObjectId, @Body() joinCompetitionDto: JoinCompetitionDto) {
        return this.competitionsService.join(competitionId, user, joinCompetitionDto)
    }

    @Post('reset-portfolio/:competition_id')
    resetPortfolio(@AuthUser() user: UserDocument, @Param('competition_id') competitionId: Types.ObjectId) {
        return this.competitionsService.resetPortfolio(competitionId, user)
    }

    @Get()
    findAll(@AuthUser() user: UserDocument, @GetPagination() pagination: Pagination) {
        return this.competitionsService.findAll(user, pagination);
    }

    @Get('/orders/:competition_id')
    async getCompOrders(@Query() query: OrderQueryDto, @Param('competition_id') competitionId: Types.ObjectId, @GetPagination() pagination: Pagination) {
        return successResponse(await this.orderService.getOrders({competition_id: competitionId, ...query}, pagination))
    }

    @Delete('orders/:order_id')
    async deleteOrder(@Param('order_id') orderId: Types.ObjectId, @AuthUser() user: UserDocument) {
        return this.orderService.deleteOrder(orderId, user)
    }

    @Get('/requests')
    competitionRequests(@AuthUser() user: UserDocument, @GetPagination() pagination: Pagination) {
        return this.competitionsService.getCompetitionRequests(user, pagination);
    }

    @Get(':competition_id')
    async findOne(@Param('competition_id') competitionId: Types.ObjectId) {
        return successResponse(await this.competitionsService.findOne({'_id': competitionId}));
    }

    @Get('leader-board/:competition_id')
    async leaderBoard(@Param('competition_id') competitionId: Types.ObjectId, @GetPagination() pagination:Pagination) {
        return this.competitionsService.leaderBoard(competitionId, pagination)
    }



    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updateCompetitionDto: UpdateCompetitionDto) {
    //   return this.competitionsService.update(+id, updateCompetitionDto);
    // }

    @Delete(':competition_id')
    remove(@Param('competition_id') competitionId: Types.ObjectId, @AuthUser() user: UserDocument) {
        return this.competitionsService.remove(competitionId, user);
    }



}
