import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {
    COMPETITION_ENTRY,
    COMPETITION_STATUS,
    COMPETITION_TYPE,
    COMPETITION_VISIBILITY
} from "../../enums/competition.enum";
import {Document, Types} from "mongoose";
import {User} from "../../users/schemas/user.schema";

export type CompetitionDocument = Competition & Document;

@Schema({timestamps: true})
export class Competition {
    @Prop({
        required: false, type: Types.ObjectId,
        ref: 'User'
    })
    owner: Types.ObjectId

    @Prop({required: true})
    name: string

    @Prop({required: true, enum: COMPETITION_VISIBILITY})
    visibility: COMPETITION_VISIBILITY

    @Prop({required: true,enum: COMPETITION_ENTRY})
    entry: COMPETITION_ENTRY

    @Prop({required: false})
    is_default: boolean

    @Prop({required: true})
    description: string

    @Prop({required: true, enum: COMPETITION_TYPE})
    type: string

    @Prop({required: true, enum: COMPETITION_STATUS, default:COMPETITION_STATUS.PENDING})
    status: COMPETITION_STATUS

    @Prop({required: false})
    capacity: number

    @Prop({required: true})
    starting_cash: number

    @Prop({required: false})
    start_date: Date

    @Prop({required: false})
    end_date: Date

    @Prop({required: false})
    market_delay: number

    @Prop({required: false})
    quick_sell: number

    @Prop({required: false})
    minimum_price: number

    @Prop({required: false})
    commission: number

    @Prop({required: false})
    password: string

    @Prop({required: true})
    allow_late_entry: number

    @Prop({required: true})
    allow_portfolio_viewing: number

    @Prop({required: true})
    allow_portfolio_resetting: number
}

export const CompetitionSchema = SchemaFactory.createForClass(Competition)
