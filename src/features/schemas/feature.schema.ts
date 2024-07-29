import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";

@Schema({timestamps: true})
export class Feature {

    @Prop({required: true})
    enum_key: string
    @Prop({required: true})
    name: string

    @Prop({required: true, unique: true})
    slug: string
}

export const FeatureSchema = SchemaFactory.createForClass(Feature);
