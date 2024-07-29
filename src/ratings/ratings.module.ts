import {Module} from '@nestjs/common';
import {RatingsService} from './ratings.service';
import {RatingsController} from './ratings.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Rating, RatingSchema} from "./schemas/rating.schema";
import {WalletModule} from "../wallet/wallet.module";
import {WalletService} from "../wallet/wallet.service";
import mongoose from "mongoose";
const mongoosePaginate = require('mongoose-paginate-v2');

@Module({
    imports: [WalletModule, MongooseModule.forFeature([{name: Rating.name, schema: RatingSchema}])],
    controllers: [RatingsController],
    providers: [RatingsService, WalletService],
    exports:[RatingsService]
})
export class RatingsModule {
    constructor() {
          mongoose.plugin(mongoosePaginate);
        }
}
