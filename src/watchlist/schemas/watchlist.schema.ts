import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import  {Types} from "mongoose";
import {User} from "../../users/schemas/user.schema";

@Schema({timestamps: true})
export class Watchlist {
    @Prop({required:true})
    symbol: string

    @Prop({type: Types.ObjectId, ref: 'User'})
    user: Types.ObjectId

    @Prop({type: Number, required:true, default: 0})
    price_alert: number

    @Prop({required:true})
    price: number

    @Prop({required:false})
    order: string
    @Prop({required:true})
    order_price: string


}

export const WatchlistSchema = SchemaFactory.createForClass(Watchlist);
