import {Prop, raw, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document, Types} from "mongoose";
import {Quiz} from "./quiz.schema";
export type LearnResourceDocument = Document & LearnResources;
@Schema({timestamps: true})
export class LearnResources {
    @Prop({required: true})
    title:string

    @Prop({required: false})
    description:string

    @Prop({required: false})
    content_type:string

    @Prop({required: false})
    content_url:string

    @Prop({required: false})
    thumbnail_url:string

    @Prop({required: false})
    author:string

    @Prop({required: false})
    provider:string

    @Prop({required: false})
    published_at:string

    @Prop({required: true, type:Types.ObjectId})
    category_id:Types.ObjectId

    @Prop({required: true})
    tags:[string]

    @Prop({required: true})
    symbols:[string]

    @Prop({ type: [Types.ObjectId], ref: 'Quiz', required: false })
    quizzes:Types.ObjectId[]

}

export const LearnResourcesSchema = SchemaFactory.createForClass(LearnResources);