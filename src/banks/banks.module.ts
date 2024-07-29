import {Global, Module} from '@nestjs/common';
import { BanksService } from './banks.service';
import { BanksController } from './banks.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Bank, BankSchema} from "./schemas/bank.schema";
@Global()
@Module({
  imports:[MongooseModule.forFeature([{name:Bank.name, schema:BankSchema}])],
  controllers: [BanksController],
  providers: [BanksService],
  exports:[BanksService]
})
export class BanksModule {}
