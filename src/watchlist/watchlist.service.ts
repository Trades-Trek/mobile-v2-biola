import {Injectable} from '@nestjs/common';
import {WatchlistDto, WatchlistPriceAlertDto} from './dto/watchlist.dto';
import {UpdateWatchlistDto} from './dto/update-watchlist.dto';
import {AuthUser} from "../decorators/user.decorator";
import {UserDocument} from "../users/schemas/user.schema";
import {Watchlist} from "./schemas/watchlist.schema";
import {InjectModel} from "@nestjs/mongoose";
import {Model, Types} from "mongoose";
import {returnErrorResponse, successResponse} from "../utils/response";
import {ERROR_MESSAGES} from "../enums/error-messages";
import {SUCCESS_MESSAGES} from "../enums/success-messages";
import {StockPriceService} from "../stock/services/stock_price.service";
import {Pagination} from "../enums/pagination.enum";
import {CompanyService} from "../stock/services/company.service";

@Injectable()
export class WatchlistService {
    constructor(@InjectModel(Watchlist.name) private watchlistModel: Model<Watchlist>, private companyService: CompanyService, private stockPriceService: StockPriceService) {

    }

    async create(stockPriceSymbol: string, user: UserDocument) {
        if (await this.findOne({
            symbol: stockPriceSymbol,
            user: user.id
        })) returnErrorResponse(ERROR_MESSAGES.ALREADY_EXIST_IN_WATCH_LIST)
        // check if stock price does exist
        const company = await this.companyService.findCompany({ticker_symbol: stockPriceSymbol}, ['id', 'ticker_symbol', 'watchlist_points']);
        if (!company) returnErrorResponse(ERROR_MESSAGES.STOCk_NOT_FOUND)
        // get stock price
        const stockPrice = await this.stockPriceService.findStockPrice({symbol: company.ticker_symbol})
        // add to watch list
        const watchList = await this.watchlistModel.create({
            symbol: stockPriceSymbol,
            user: user.id,
            price: stockPrice.last
        })
        company.watchlist_points++
        await company.save()
        return successResponse({watch_list: watchList, message: SUCCESS_MESSAGES.STOCK_PRICE_ADDED_TO_WATCHLIST})
    }

    async setPriceAlert(watchlistId: string, priceAlertDto: WatchlistPriceAlertDto, user: UserDocument) {
        let watchlist = await this.watchlistModel.findById(watchlistId)
        if (!watchlist) returnErrorResponse(ERROR_MESSAGES.WATCHLIST_NOT_FOUND)

        if (watchlist.user !== user.id) returnErrorResponse('Unauthorised')
        // set price alert
        const updateFields = {
            price_alert: priceAlertDto.value,
            order: priceAlertDto.order,
            order_price: priceAlertDto.order_price
        }
        watchlist = await this.watchlistModel.findByIdAndUpdate(watchlistId, updateFields, {new: true})
        return successResponse({watchlist, message: 'successful'})
    }


    async findAll(user: UserDocument, paginationParams: Pagination) {
        const watchLists = await this.watchlistModel.find({user: user.id}, {}, {
            limit: paginationParams.limit,
            skip: paginationParams.page
        }).lean().select('id symbol').exec();

        if (watchLists && watchLists.length) {
            for (const w of watchLists) {
                w['company'] = await this.companyService.findCompany({'ticker_symbol': w.symbol}, ['ticker_symbol', 'name', 'logo_url'])
            }
        }
        return successResponse({my_watch_lists: watchLists})
    }

    async findOne(filter: Object): Promise<Watchlist | undefined> {
        return this.watchlistModel.findOne(filter);
    }

    async remove(user: UserDocument, symbol: string) {
        if (!await this.watchlistModel.findOneAndDelete({
            symbol,
            user: user.id
        })) returnErrorResponse('Could not remove stock from watchlist')
        return successResponse(SUCCESS_MESSAGES.STOCK_PRICE_REMOVED_FROM_WATCHLIST)
    }

    // admin resource

    async deleteUserWatchlist(watchlistId: Types.ObjectId) {
        if (!await this.watchlistModel.findByIdAndDelete(watchlistId)) returnErrorResponse('Could not remove stock from watchlist')
        return successResponse(SUCCESS_MESSAGES.STOCK_PRICE_REMOVED_FROM_WATCHLIST)
    }

}
