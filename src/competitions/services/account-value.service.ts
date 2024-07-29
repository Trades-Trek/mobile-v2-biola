import {forwardRef, Inject, Injectable} from "@nestjs/common";
import {UserDocument} from "../../users/schemas/user.schema";
import {Model, Types} from "mongoose";
import {CompetitionsService} from "./competitions.service";
import {OrdersService} from "../../orders/orders.service";
import {StockPriceService} from "../../stock/services/stock_price.service";
import {InjectModel} from "@nestjs/mongoose";
import {AccountValue} from "../schemas/account-value.schema";
import {Pagination} from "../../enums/pagination.enum";

@Injectable()
export class AccountValueService {
    constructor(@Inject(forwardRef(() => CompetitionsService)) private competitionService: CompetitionsService, @Inject(forwardRef(() => OrdersService)) private orderService: OrdersService, private stockPriceService: StockPriceService, @InjectModel(AccountValue.name) private accountValueModel: Model<AccountValue>) {
    }

    async getAccountAndCashValue(user: UserDocument, competitionId: Types.ObjectId): Promise<{ accountValue: number, cashValue: number }> {
        let latestAccountValue = 0;
        // retrieve total starting cash
        const cashValue = await this.competitionService.getTotalStartingCash(user.id, competitionId);

        latestAccountValue += cashValue
        // retrieve user stocks
        const userStocks = await this.orderService.getUserStocks(user, competitionId)

        if (userStocks && userStocks.length > 0) {
            for (const stock of userStocks) {
                const stockPrice = await this.stockPriceService.findStockPrice({symbol: stock.stock_symbol})
                latestAccountValue += stockPrice.last
            }
            const previousAccountValue = await this.getPreviousAccountValue(user, competitionId)
            if (latestAccountValue !== previousAccountValue) this.createNewAccountValue(user.id, latestAccountValue, competitionId)
        }
        return {accountValue: latestAccountValue, cashValue};
    }

    async getTodayPercentageChange(user: UserDocument, competitionId: Types.ObjectId): Promise<number> {
        const prevAccountVal = await this.getPreviousAccountValue(user, competitionId)
        const previousAccountValue = prevAccountVal ? prevAccountVal : 0
        const {accountValue: latestAccountValue} = await this.getAccountAndCashValue(user, competitionId)
        const increaseOrDecrease = latestAccountValue - previousAccountValue
        console.log((previousAccountValue < latestAccountValue ? increaseOrDecrease / previousAccountValue : increaseOrDecrease / latestAccountValue) * 100)
        return (previousAccountValue < latestAccountValue ? increaseOrDecrease / previousAccountValue : increaseOrDecrease / latestAccountValue) * 100
    }

    async createNewAccountValue(userId: Types.ObjectId, value, competitionId: Types.ObjectId) {
        return await this.accountValueModel.create({user: userId, value, competition: competitionId})
    }

    async getPreviousAccountValue(user: UserDocument, competitionId: Types.ObjectId): Promise<number> {
        const accountValue = await this.accountValueModel.findOne({
            user: user.id,
            competition: competitionId
        }).sort({created_at: -1}).exec();
        return accountValue ? accountValue.value : 0
    }

    async getAccountValueList(user: UserDocument, competitionId: Types.ObjectId, pagination?: Pagination) {
        return await this.accountValueModel.find({
            user: user.id,
            competition: competitionId
        }).skip(pagination.page).limit(pagination.limit).exec()
    }
}