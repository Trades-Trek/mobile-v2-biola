import {Global, Module} from '@nestjs/common';
import {ReferralsService} from './referrals.service';
import {ReferralsController} from './referrals.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Referral, RefferalSchema} from "./schemas/referral.schema";
import {WalletModule} from "../wallet/wallet.module";
import {WalletService} from "../wallet/wallet.service";

@Global()
@Module({
    imports: [WalletModule, MongooseModule.forFeature([{name: Referral.name, schema: RefferalSchema}])],
    controllers: [ReferralsController],
    providers: [ReferralsService, WalletService],
    exports:[ReferralsService]
})
export class ReferralsModule {
}
