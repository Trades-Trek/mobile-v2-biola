import {forwardRef, Module} from '@nestjs/common';
import {OrdersService} from './orders.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Order, OrderSchema} from "./schemas/order.schema";
import {CompetitionsModule} from "../competitions/competitions.module";
import {WalletModule} from "../wallet/wallet.module";
import {AccountValue, AccountValueSchema} from "../competitions/schemas/account-value.schema";

@Module({
    imports: [WalletModule,forwardRef(() => CompetitionsModule), MongooseModule.forFeature([{name: Order.name, schema: OrderSchema}, {name:AccountValue.name, schema:AccountValueSchema}])],
    providers: [OrdersService],
    exports: [OrdersService]
})
export class OrdersModule {
}
