import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Types} from "mongoose";

@Schema({timestamps: true})
export class ResourceTag {
    @Prop({required: true})
    tag:string
}

export const ResourceTagSchema = SchemaFactory.createForClass(ResourceTag);