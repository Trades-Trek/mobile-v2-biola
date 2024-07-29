import {Global, Module} from '@nestjs/common';
import { StockPriceService } from './services/stock_price.service';
import { StockController } from './stock.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {StockPrice} from "./entities/stock_prices.entity";
import {Company} from "./entities/companies.entity";
import {CompanyService} from "./services/company.service";
import {Exchange} from "./entities/exchange.entity";
import {StockNews} from "./entities/stock_news.entity";

@Global()
@Module({
  imports:[TypeOrmModule.forFeature([Company, StockPrice, Exchange, StockNews])],
  controllers: [StockController],
  providers: [StockPriceService, CompanyService],
  exports:[StockPriceService,CompanyService]
})
export class StockModule {}
