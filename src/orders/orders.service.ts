import {Injectable} from '@nestjs/common';
import {CreateOrderDto, OrderQueryDto} from './dto/create-order.dto';
import {Model, Types} from "mongoose";
import {UserDocument} from "../users/schemas/user.schema";
import {CompetitionsService} from "../competitions/services/competitions.service";
import {returnErrorResponse, successResponse} from "../utils/response";
import {CompanyService} from "../stock/services/company.service";
import {ORDER_STATUS, ORDER_TYPE, TRADE_ACTION} from "../enums/orders.enum";
import {StockPriceService} from "../stock/services/stock_price.service";
import {WalletService} from "../wallet/wallet.service";
import {ERROR_MESSAGES} from "../enums/error-messages";
import {Cron, CronExpression, SchedulerRegistry} from "@nestjs/schedule";
import {CronJob} from "cron";
import {useDateToCron} from "../utils/constant";
import useDayJs from "../services/dayjs"
import {Order, OrderDocument} from "./schemas/order.schema";
import {NotificationsService} from "../notifications/notifications.service";
import {InjectModel} from "@nestjs/mongoose";
import {EventEmitter2, OnEvent} from "@nestjs/event-emitter";
import {ExecuteOrderEvent} from "../events/ExecuteOrderEvent.event";
import {Exchange} from "../stock/entities/exchange.entity";
import {Pagination} from "../enums/pagination.enum";
import Func = jest.Func;
import {Company} from "../stock/entities/companies.entity";
import {isEmpty} from "class-validator";
import {Role} from "../enums/role.enum";
import {SUCCESS_MESSAGES} from "../enums/success-messages";


@Injectable()
export class OrdersService {
    constructor(private competitionService: CompetitionsService, private companyService: CompanyService, private stockPriceService: StockPriceService, private walletService: WalletService, private schedulerRegistry: SchedulerRegistry, @InjectModel(Order.name) private orderModel: Model<Order>, private notificationService: NotificationsService, private eventEmitter: EventEmitter2) {
    }

    async create(stockPriceSymbol: string, createOrderDto: CreateOrderDto, user: UserDocument) {
        const {competition_id, order_type, price, quantity, duration, trade_action} = createOrderDto;
        console.log('inside')
        // retrieve company
        const company = await this.companyService.findCompany({ticker_symbol: stockPriceSymbol})
        if (!company) returnErrorResponse(ERROR_MESSAGES.STOCk_NOT_FOUND)
        // retrieve competition
        const competition = await this.competitionService.findOne({'_id': competition_id})
        if (!competition) returnErrorResponse('Competition not found')
        // retrieve participant
        const participant = await this.competitionService.findOrCreateParticipant(competition.id, user.email)
        if (!participant) returnErrorResponse('Not a participant of this competition')
        console.log('passed competition')
        // retrieve stock price
        const stockPrice = await this.stockPriceService.findStockPrice({symbol: company.ticker_symbol})
        if (!stockPrice) returnErrorResponse(ERROR_MESSAGES.STOCk_NOT_FOUND)
        console.log('passed stock price')
        // validate trade action(buy/sell)
        if (trade_action === TRADE_ACTION.BUY && order_type === ORDER_TYPE.LIMIT && price >= stockPrice.last) returnErrorResponse('Limit price should be less than stock price when buying stock')
        else if (trade_action === TRADE_ACTION.SELL && order_type === ORDER_TYPE.LIMIT && price <= stockPrice.last) returnErrorResponse('Limit price should be greater than stock price when buying stock')
        // calculate amount in cash
        let amountToBePaidInCash = order_type === ORDER_TYPE.LIMIT ? quantity * price : quantity * stockPrice.last;
        // check if commission should be added
        if (competition.commission) amountToBePaidInCash += competition.commission
        // ensure user has enough cash
        if (participant.starting_cash < amountToBePaidInCash) returnErrorResponse(ERROR_MESSAGES.INSUFFICIENT_WALLET_BALANCE)
        // create order
        const order = await this.orderModel.create({
            competition: competition_id,
            price: order_type === ORDER_TYPE.LIMIT ? price : stockPrice.last,
            duration,
            quantity,
            company_id: company.id,
            stock_symbol: stockPrice.symbol,
            exchange: company.exchange,
            trade_action,
            user_id: user.id,
            commission: competition.commission,
            market_delay: competition.market_delay,
            quick_sell: competition.quick_sell,
            type: order_type,
            user: user.id
        })
        if (order_type === ORDER_TYPE.MARKET) {
            const delay = order.trade_action === TRADE_ACTION.BUY ? order.market_delay ?? null : order.quick_sell ?? null;
            if (delay) {
                this.addCronJob(order.id, delay, () => {
                    this.eventEmitter.emit(
                        'order.execute',
                        new ExecuteOrderEvent(order.id, user),
                    )
                })
            } else {
                this.eventEmitter.emit(
                    'order.execute',
                    new ExecuteOrderEvent(order.id, user),
                )
            }
        }
        return successResponse('order placed successfully')
    }

    addCronJob(name: string, minutes, method: Func) {
        const nextDate = useDayJs.addMinutes(Date.now(), minutes)
        const cronDate = useDateToCron(new Date(nextDate))
        const job = new CronJob(cronDate, method);

        this.schedulerRegistry.addCronJob(name, job);
        job.start();

        console.log(
            `job ${name} added for each minute at ${minutes} minutes!`,
        );
    }

    @OnEvent('order.execute')
    async executeOrder(payload: ExecuteOrderEvent) {
        const {orderId, user} = payload;
        const userData: any = user;
        const order = await this.orderModel.findById(orderId)
        if (!order) return

        const orderExchange = await Exchange.findOne({
            where: {symbol: order.exchange},
            select: {id: true, symbol: true, open_time: true, close_time: true}
        })

        if (orderExchange && orderExchange.close_time > Date.now().toString()) {
            const stockPrice = await this.stockPriceService.findStockPrice({symbol: order.stock_symbol})
            // retrieve participant
            const participant = await this.competitionService.findOrCreateParticipant(order.competition, userData.email)
            const amountToBePaidInCash = stockPrice.last + order.commission
            if (participant.starting_cash < amountToBePaidInCash) {
                this.updateOrderStatus(order, ORDER_STATUS.FAILED, 'insufficient starting cash')
            } else {
                await participant.updateOne({$inc: {starting_cash: order.trade_action === TRADE_ACTION.SELL ? stockPrice.last : -stockPrice.last}})
                this.updateOrderStatus(order, ORDER_STATUS.COMPLETED, 'Order executed successfully')

            }
        }
    }

    async updateOrderStatus(order: OrderDocument, status: ORDER_STATUS, message: string = null) {
        console.log('order completed')
        await order.updateOne({status}, {new: true})
        const company = await this.companyService.findCompany({id: order.company_id}, ['id', 'trade_points'])
        if (company) company.trade_points++
        await company.save();
        switch (status) {
            case ORDER_STATUS.FAILED:
                break;
            case ORDER_STATUS.COMPLETED:
                break;
            case ORDER_STATUS.CANCELLED:
        }
    }

    @Cron(CronExpression.EVERY_10_MINUTES)
    async handleLimitOrders() {
        console.log('running cronjob every 10 minutes')
        const orders = await this.orderModel.find({
            status: ORDER_STATUS.PENDING,
            type: ORDER_TYPE.LIMIT
        }).populate('user').exec();
        if (orders && orders.length) {
            for (const order of orders) {
                const stockPrice = await this.stockPriceService.findStockPrice({symbol: order.stock_symbol})
                // retrieve stock exchange
                const last = stockPrice.last;
                console.log(`stock current price - ${last}`)
                const conditionsMet = order.trade_action === TRADE_ACTION.BUY && last <= order.price ? true : order.trade_action === TRADE_ACTION.SELL && last >= order.price;
                const delay = order.trade_action === TRADE_ACTION.BUY ? order.market_delay ?? null : order.quick_sell ?? null;
                if (conditionsMet) {
                    console.log('order conditions met')
                    if (delay) {
                        this.addCronJob(order.id, delay, () => {
                            this.eventEmitter.emit(
                                'order.execute',
                                new ExecuteOrderEvent(order.id, order.user),
                            )
                        })
                    } else {
                        this.eventEmitter.emit(
                            'order.execute',
                            new ExecuteOrderEvent(order.id, order.user),
                        )
                    }
                } else {
                    console.log('order conditions not met')
                }
            }
        }
    }

    async getUserStocks(user: UserDocument, competitionId: Types.ObjectId, status: ORDER_STATUS = ORDER_STATUS.COMPLETED, tradeAction: TRADE_ACTION = TRADE_ACTION.BUY, pagination?: Pagination) {
        return await this.orderModel.find({
            user_id: user.id,
            competition: competitionId,
            trade_action: tradeAction,
            status
        }).exec()
    }

    async getOrders(query: OrderQueryDto, pagination: Pagination) {
        const filter = {};
        Object.keys(query).forEach(key => {
            if (!isEmpty(query[key]) && key !== 'page' && key !== 'limit') {
                filter[key] = query[key];
            }
        });
        const count = await this.orderModel.countDocuments(filter);
        const orders = await this.orderModel.find(filter).skip(pagination.page).limit(pagination.limit).exec()
        return {orders, total_rows: count}
    }

    async deleteOrder(orderId: Types.ObjectId, user: UserDocument) {
        const order = user.role === Role.ADMIN ? await this.orderModel.findById(orderId) : await this.orderModel.findOne({
            '_id': orderId,
            user_id: user.id
        })
        if (!order) returnErrorResponse(ERROR_MESSAGES.ORDER_NOT_FOUND)
        await order.deleteOne();
        return successResponse('order deleted successfully');
    }

}
