import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {CURRENCIES, DEFAULT_CURRENCY} from "../../utils/constant";
import {Document, Types} from "mongoose";
export type BankDocument = Bank & Document;
@Schema({timestamps:true})
export class Bank {
    @Prop({ required: false })
    account_name: string;

    @Prop({ required: true })
    recipient_code: string;

    @Prop({ required: false, default:DEFAULT_CURRENCY.code })
    currency: string;

    @Prop({ required: true})
    recipient_id: string;

    @Prop({ required: false })
    auth_code: string;

    @Prop({ required: false })
    email: string;

    @Prop({ required: true })
    bank_name: string;

    @Prop({ required: true})
    account_number: string;

    @Prop({ required: true })
    bank_id: string;

    @Prop({ required: true })
    bank_code: string;

    @Prop({ required: true, type: Types.ObjectId})
    user_id: Types.ObjectId;
}

export const BankSchema = SchemaFactory.createForClass(Bank);
