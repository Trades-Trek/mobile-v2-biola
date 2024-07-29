import {Prop, raw, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Types} from "mongoose";
import {Plan} from "./plan.schema";
import {Feature} from "../../features/schemas/feature.schema";


@Schema({timestamps: true})
export class PlanFeature {
    @Prop({
        type: Types.ObjectId,
        ref: 'Plan',
        required: true,
    })
    plan: Plan;

    @Prop({
        type: Types.ObjectId,
        ref: 'Feature',
        required: true,
    })
    feature: Feature;
}

export const PlanFeatureSchema = SchemaFactory.createForClass(PlanFeature);
