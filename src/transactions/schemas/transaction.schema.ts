import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document, Types} from "mongoose";
import {TRANSACTION_STATUS} from "../../enums/transaction_status";
import {TRANSACTION_ENTITY, TRANSACTION_TYPE} from "../../enums/transaction_type";

export type TransactionDocument = Transaction & Document;

@Schema({timestamps: true})
export class Transaction {
    @Prop()
    amount: number;

    @Prop({type: Types.ObjectId, required: true})
    user_id: Types.ObjectId

    @Prop({type: String, required: false})
    transfer_code: string

    @Prop({type: String, required: true})
    reference: string


    @Prop({enum: TRANSACTION_TYPE, required: true})
    type: TRANSACTION_TYPE

    @Prop({enum: TRANSACTION_ENTITY, required: true})
    entity: string

    @Prop({required: true, default:0})
    conversion_rate: number

    @Prop({required: true, default:0})
    wallet_balance_before_transaction: number

    @Prop({required: true, default:0})
    trek_coin_balance_before_transaction: number

    @Prop()
    description: string

    @Prop({enum: TRANSACTION_STATUS, required: true, default: TRANSACTION_STATUS.SUCCESS})
    status: TRANSACTION_STATUS

    // @Prop({required:false})
    // description: string

}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);