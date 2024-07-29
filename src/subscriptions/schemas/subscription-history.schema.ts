import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document, Types} from "mongoose";

export type SubscriptionHistoryDocument = SubscriptionHistory & Document;

@Schema({timestamps: true})
export class SubscriptionHistory {
    @Prop()
    amount: number;

    @Prop({type: Types.ObjectId, required: true})
    user_id: Types.ObjectId

    @Prop({type: Types.ObjectId, required: true})
    plan_id: Types.ObjectId

    @Prop()
    expire_at: Date

}

export const SubscriptionHistorySchema = SchemaFactory.createForClass(SubscriptionHistory);