import {Prop, raw, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Types} from "mongoose";
import {Plan} from "./plan.schema";


@Schema({timestamps: true})
export class Listing {
    @Prop({
        required: true,
    })
    name: string;


}

export const ListingSchema = SchemaFactory.createForClass(Listing);


