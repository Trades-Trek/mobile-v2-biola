import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Types,Document} from "mongoose";
import {ORDER_DURATION, ORDER_STATUS, ORDER_TYPE, TRADE_ACTION} from "../../enums/orders.enum";

export type OrderDocument = Order & Document;
@Schema({timestamps: true})
export class Order {
    @Prop({required: true})
    user_id: Types.ObjectId

    @Prop({
        required: false, type: Types.ObjectId,
        ref: 'User'
    })
    user: Types.ObjectId

    @Prop({
        required: false, type: Types.ObjectId,
        ref: 'Competition'
    })
    competition: Types.ObjectId

    @Prop({required: true, enum: ORDER_TYPE})
    type: ORDER_TYPE

    @Prop({required: true, enum: ORDER_DURATION})
    duration: ORDER_DURATION

    @Prop({required: true})
    price: number

    @Prop({required: true})
    quantity: number

    @Prop({required: true})
    company_id: number

    @Prop({required: true})
    stock_symbol: string

    @Prop({required: true})
    exchange: string

    @Prop({required: true})
    market_delay: number

    @Prop({required: true})
    quick_sell: number

    @Prop({required: true, enum: TRADE_ACTION})
    trade_action: TRADE_ACTION

    @Prop({required: true, enum: ORDER_STATUS, default:ORDER_STATUS.PENDING})
    status: ORDER_STATUS

    @Prop({required: true, default: 0})
    commission: number

    @Prop({required: false})
    message: string


}

export const OrderSchema = SchemaFactory.createForClass(Order)
