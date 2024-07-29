import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {COMPETITION_TYPE} from "../../enums/competition.enum";
import {Document, Types} from "mongoose";

export type AccountValueDocument = AccountValue & Document;

@Schema({timestamps: true})
export class AccountValue {
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

    @Prop({nullable: false})
    value:number



}

export const AccountValueSchema = SchemaFactory.createForClass(AccountValue)
