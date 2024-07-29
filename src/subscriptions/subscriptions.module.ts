import {Global, Module} from '@nestjs/common';
import {SubscriptionsService} from './subscriptions.service';
import {SubscriptionsController} from './subscriptions.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {SubscriptionHistory, SubscriptionHistorySchema} from "./schemas/subscription-history.schema";
import {WalletModule} from "../wallet/wallet.module";
import {WalletService} from "../wallet/wallet.service";
@Module({
    imports: [WalletModule, MongooseModule.forFeature([{
        name: SubscriptionHistory.name,
        schema: SubscriptionHistorySchema
    }])],
    controllers: [SubscriptionsController],
    providers: [WalletService, SubscriptionsService],
    exports:[SubscriptionsService]
})
export class SubscriptionsModule {
}
