import {Global, Module} from '@nestjs/common';
import {TransactionsService} from './transactions.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Transaction, TransactionSchema} from "./schemas/transaction.schema";
import {TransactionsController} from "./transactions.controller";
import {WalletModule} from "../wallet/wallet.module";
import {WalletService} from "../wallet/wallet.service";

@Global()
@Module({
    imports: [WalletModule,MongooseModule.forFeature([{name: Transaction.name, schema: TransactionSchema}])],
    controllers:[TransactionsController],
    providers: [TransactionsService, WalletService],
    exports:[TransactionsService]
})
export class TransactionsModule {
}
