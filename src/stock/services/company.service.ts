import {Injectable} from '@nestjs/common';
import {StockPrice} from "../entities/stock_prices.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {returnErrorResponse, successResponse} from "../../utils/response";
import {Company} from "../entities/companies.entity";
import {ERROR_MESSAGES} from "../../enums/error-messages";
import {Exchange} from "../entities/exchange.entity";
import {StockNews} from "../entities/stock_news.entity";
import {Pagination} from "../../enums/pagination.enum";

@Injectable()
export class CompanyService {
    constructor(@InjectRepository(Company)
                private companyRepository: Repository<Company>) {
    }


    async findAll(pagination: Pagination) {
        const [companies, count] = await this.companyRepository.findAndCount({
            relations:{stock_price:true},
            select: {
                id:true,
                name: true,
                logo_url: true,
                watchlist_points:true,
                trade_points:true,
                stock_price: {
                    per_change: true,
                    last: true,
                    open: true
                }
            },
            order: {watchlist_points: 'DESC'},
            take: pagination.limit,
            skip: pagination.page
        });
        return successResponse({companies, total_rows:count})
    }

    async findCompany(filter: any, columnsToLoad?: Array<string>): Promise<Company | undefined> {
        let columns_to_load;
        columns_to_load = columns_to_load && columnsToLoad.length ? columnsToLoad : ['id', 'name', 'ticker_symbol', 'exchange']
        return await this.companyRepository.findOne({where: filter, select: columns_to_load});
    }

    async stockDetails(stockSymbol: string) {
        const company = await this.companyRepository.findOne({
            where: {ticker_symbol: stockSymbol},
            relations: {stock_price: true},
            select: {
                id: true,
                ticker_symbol: true,
                name: true,
                exchange: true,
                description: true,
                trademarks: true,
                ceo_name: true,
                website_url: true,
                cfo_name: true,
                sub_sector: true,
                business_nature: true,
                sector: true,
                logo_url: true,
                stock_price: {
                    change: true,
                    per_change: true,
                    company_id: true,
                    id: true,
                    last: true,
                }
            }
        })
        if (!company) returnErrorResponse(ERROR_MESSAGES.STOCk_NOT_FOUND)
        company['related_stocks'] = await this.companyRepository.find({
            relations: {stock_price: true},
            where: [
                {sector: company.sector},
                {business_nature: company.business_nature},
                {sub_sector: company.sub_sector}
            ],
            select: {stock_price: {change: true, last: true, per_change: true}},
            take: 10
        })
        company['stock_exchange'] = await Exchange.findOne({
            where: {symbol: company.exchange},
            select: {symbol: true, open_time: true, close_time: true}
        })
        return successResponse({stock_details: company})
    }

    async stockNews(stockSymbol: string,) {
        const company = await this.findCompany({ticker_symbol: stockSymbol})
        if (!company) returnErrorResponse(ERROR_MESSAGES.STOCk_NOT_FOUND)
        const latestNews = await StockNews.find({
            where: {company_id: company.id},
            order: {created_at: 'DESC'},
            take: 10
        })
        return successResponse({latest_news: latestNews})
    }

    async compareStocks(stockSymbolOne: string, stockSymbolTwo: string) {
        const stockOne = await this.companyRepository.findOne({where: {ticker_symbol: stockSymbolOne}})
        const stockTwo = await this.companyRepository.findOne({where: {ticker_symbol: stockSymbolTwo}})
        if (!stockOne || !stockTwo) returnErrorResponse(ERROR_MESSAGES.STOCk_NOT_FOUND)
        const responseData = {
            stockSymbolOne: stockOne,
            stockSymbolTwo: stockTwo
        }
        return successResponse(responseData)
    }

    async getTopGainers(pagination: Pagination) {
        const topGainers = await this.companyRepository.createQueryBuilder("companies").select(['companies.name', 'companies.ticker_symbol', 'companies.logo_url', 'companies.id', 'stock_price.per_change', 'stock_price.last', 'stock_price.symbol']).leftJoin("companies.stock_price", 'stock_price').groupBy("stock_price.symbol").orderBy("stock_price.per_change", "DESC").skip(pagination.page).take(pagination.limit).getMany();
        return successResponse({top_gainers: topGainers})
    }

    async getTopLosers(pagination: Pagination) {
        const topLosers = await this.companyRepository.createQueryBuilder("companies").select(['companies.name', 'companies.ticker_symbol', 'companies.logo_url', 'companies.id', 'stock_price.per_change', 'stock_price.last', 'stock_price.symbol']).leftJoin("companies.stock_price", 'stock_price').groupBy("stock_price.symbol").orderBy("stock_price.per_change", "ASC").skip(pagination.page).take(pagination.limit).getMany();

        return successResponse({top_losers: topLosers})
    }


}
