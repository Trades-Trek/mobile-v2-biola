import {forwardRef, Module} from '@nestjs/common';
import {CompetitionsService} from './services/competitions.service';
import {CompetitionsController} from './competitions.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Competition, CompetitionSchema} from "./schemas/competition.schema";
import {Participant, ParticipantSchema} from "./schemas/participant.schema";
import {WalletModule} from "../wallet/wallet.module";
import {WalletService} from "../wallet/wallet.service";
import {AccountValue, AccountValueSchema} from "./schemas/account-value.schema";
import {AccountValueService} from "./services/account-value.service";
import {OrdersModule} from "../orders/orders.module";

@Module({
    imports: [OrdersModule, WalletModule, MongooseModule.forFeature([{name: Competition.name, schema: CompetitionSchema}, {name:Participant.name, schema:ParticipantSchema}, {name:AccountValue.name, schema:AccountValueSchema}])],
    controllers: [CompetitionsController],
    providers: [CompetitionsService, WalletService, AccountValueService],
    exports:[CompetitionsService, AccountValueService]
})
export class CompetitionsModule {
}
