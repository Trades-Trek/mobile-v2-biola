import {Injectable} from '@nestjs/common';

import {StockPrice} from "../entities/stock_prices.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {returnErrorResponse, successResponse} from "../../utils/response";
import {Pagination} from "../../enums/pagination.enum";
import {ERROR_MESSAGES} from "../../enums/error-messages";

@Injectable()
export class StockPriceService {
    constructor(@InjectRepository(StockPrice)
                private stockPriceRepository: Repository<StockPrice>) {
    }


    async findAll() {
        const stockPrices = await this.stockPriceRepository.find();
        return successResponse({stock_prices: stockPrices})
    }





    async findStockPrice(filter: any, columnsToLoad?: Array<string>): Promise<StockPrice> {
        let columns_to_load;
        columns_to_load = columnsToLoad && columnsToLoad.length ? columnsToLoad : ['company_id', 'id', 'symbol', 'last']
        return await this.stockPriceRepository.findOne({where: filter, select: columns_to_load});
    }




}
