import {Prop, raw, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Types} from "mongoose";
import {Plan} from "./plan.schema";
import {Listing} from "./listing.schema";


@Schema({timestamps: true})
export class PlanListing {
    @Prop({
        type: Types.ObjectId,
        ref: 'Plan',
        required: true,
    })
    plan: Plan;

    @Prop({
        type: Types.ObjectId,
        ref: 'Listing',
        required: true,
    })
    listing: Listing;
}

export const PlanListingSchema = SchemaFactory.createForClass(PlanListing);
