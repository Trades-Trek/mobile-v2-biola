import {Controller, Get, Post, Body, Patch, Param, Delete, Query} from '@nestjs/common';
import {StockPriceService} from './services/stock_price.service';
import {CreateStockDto} from './dto/create-stock.dto';
import {UpdateStockDto} from './dto/update-stock.dto';
import {Public} from "../decorators/public-endpoint.decorator";
import {GetPagination} from "../decorators/pagination.decorator";
import {Pagination} from "../enums/pagination.enum";
import {CompanyService} from "./services/company.service";

@Public()
@Controller('stocks')
export class StockController {
    constructor(private readonly stockPriceService: StockPriceService, private companyService: CompanyService) {
    }


    @Get()
    findAll(@Query() query:Pagination,  @GetPagination() pagination: Pagination) {
        return this.companyService.findAll(pagination);
    }

    @Public()
    @Get('details/:stock_symbol')
    stockDetails(@Param('stock_symbol') stockSymbol: string) {
        return this.companyService.stockDetails(stockSymbol);
    }

    @Public()
    @Get('/:stock_symbol/news')
    stockNews(@Param('stock_symbol') stockSymbol: string) {
        return this.companyService.stockNews(stockSymbol);
    }

    @Public()
    @Get('compare/:stock_symbol_one/:stock_symbol_two')
    compare(@Param('stock_symbol_one') stockSymbolOne: string, @Param('stock_symbol_two') stockSymbolTwo: string,) {
        return this.companyService.compareStocks(stockSymbolOne, stockSymbolTwo);
    }

    @Public()
    @Get('/top-gainers')
    topGainers(@GetPagination() pagination: Pagination) {
        return this.companyService.getTopGainers(pagination);
    }

    @Public()
    @Get('/top-losers')
    topLosers(@GetPagination() pagination: Pagination) {
        return this.companyService.getTopLosers(pagination);
    }

}
