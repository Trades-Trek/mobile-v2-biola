import {Prop, raw, Schema, SchemaFactory} from "@nestjs/mongoose";
import {SUBSCRIPTION_DURATION} from "../../enums/subscription_duration";
import {Document, Types} from "mongoose";
import {PlAN_STATUS, PLAN_TYPE} from "../../enums/plan_type";

export type PlanDocument = Plan & Document;

@Schema({timestamps: true})
export class Plan {
    @Prop({required: true})
    name: string

    @Prop({required: false})
    description: string

    @Prop({required: true})
    amount: number

    @Prop({required: false, enum: SUBSCRIPTION_DURATION})
    duration: SUBSCRIPTION_DURATION;

    @Prop({required: false, default: PLAN_TYPE.PAID, enum:PLAN_TYPE})
    type: PLAN_TYPE

    @Prop({required: true, default: 30})
    no_of_days: number;

    @Prop({type:Boolean, default:false})
    is_gift_plan:boolean

    @Prop({ enum:PlAN_STATUS, default:PlAN_STATUS.ACTIVE})
    status:PlAN_STATUS

}

export const PlanSchema = SchemaFactory.createForClass(Plan);
